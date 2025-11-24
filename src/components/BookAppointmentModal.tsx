import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getPublicBookingData, createBooking, type Service, type AvailableDate } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookAppointmentModal({ isOpen, onClose }: Props) {
  // Data State
  const [services, setServices] = useState<Service[]>([]);
  const [schedule, setSchedule] = useState<AvailableDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Selection State
  const [step, setStep] = useState(0); // 0: Service, 1: Level, 2: Date, 3: Time, 4: Contact, 5: Success
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<AvailableDate | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [customDesignImage, setCustomDesignImage] = useState<File | null>(null);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      resetForm();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getPublicBookingData();
      setServices(data.services);
      setSchedule(data.availableDates);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load booking data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(0);
    setSelectedService(null);
    setSelectedLevel(null);
    setSelectedPrice(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setCustomDesignImage(null);
    setContactMethod('email');
    setSubmitting(false);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    // Default to level1
    setSelectedLevel('level1');
    setSelectedPrice(service.prices['level1']);
    setStep(1);
  };

  const handleLevelSelect = (level: string, price: number) => {
    setSelectedLevel(level);
    setSelectedPrice(price);
    setStep(2);
  };

  const handleDateSelect = (date: AvailableDate) => {
    setSelectedDate(date);
    if (date.type === 'full-day') {
      setSelectedTime('Full Day'); // Auto-select time for full-day
      setStep(4); // Skip time selection
    } else {
      setStep(3);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleSubmit = async () => {
    // Validate based on contact method
    const isContactValid = contactMethod === 'email' ? clientEmail : clientPhone;
    if (!selectedService || !selectedDate || !clientName || !isContactValid || !selectedLevel) return;

    setSubmitting(true);
    try {
      // Convert date from yyyy-mm-dd to dd/mm/yyyy
      const [year, month, day] = selectedDate.date.split('-');
      const formattedDate = `${day}/${month}/${year}`;

      const bookingPayload = {
        name: clientName,
        email: contactMethod === 'email' ? clientEmail : undefined,
        phone: contactMethod === 'phone' ? clientPhone : undefined,
        service: selectedService.name,
        level: selectedLevel,
        date: formattedDate,
        time: selectedTime || undefined,
      };

      if (customDesignImage) {
        const formData = new FormData();
        Object.entries(bookingPayload).forEach(([key, value]) => {
          if (value !== undefined) formData.append(key, value);
        });
        formData.append('customDesignImage', customDesignImage);
        await createBooking(formData);
      } else {
        await createBooking(bookingPayload);
      }
      setStep(5); // Success step
    } catch (error: any) {
      alert('Booking failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (step === 0) return;
    if (step === 4 && selectedDate?.type === 'full-day') {
      setStep(2); // Go back to Date from Contact if full-day
    } else {
      setStep(step - 1);
    }
  };

  // Render Steps
  const renderStepContent = () => {
    switch (step) {
      case 0: // Service Selection
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white mb-4">Select a Service</h3>
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service) => (
                <button
                  key={service.name}
                  onClick={() => handleServiceSelect(service)}
                  className="w-full p-4 bg-[#4A3728] border border-[#E8B4A8]/30 rounded-xl flex justify-between items-center hover:bg-[#E8B4A8]/10 transition text-left"
                >
                  <span className="font-medium text-white">{service.name}</span>
                  <span className="text-[#E8B4A8]">From £{service.prices.level1.toLocaleString()}</span>
                </button>
              ))
            ) : (
              <div className="text-center text-white/50 py-8">No services available.</div>
            )}
          </div>
        );

      case 1: // Level Selection
        if (!selectedService) return null;
        
        // Default to level1 if not set
        const currentLevel = selectedLevel || 'level1';
        const currentPrice = selectedService.prices[currentLevel as keyof typeof selectedService.prices];

        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white mb-4">Select Level for {selectedService.name}</h3>
            
            {/* Level Dropdown */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Choose Level</label>
              <select
                value={currentLevel}
                onChange={(e) => {
                  const newLevel = e.target.value;
                  const newPrice = selectedService.prices[newLevel as keyof typeof selectedService.prices];
                  setSelectedLevel(newLevel);
                  setSelectedPrice(newPrice);
                }}
                className="w-full p-3 bg-[#4A3728] border border-[#E8B4A8]/30 rounded-xl text-white focus:border-[#E8B4A8] outline-none appearance-none"
              >
                {Object.entries(selectedService.prices).map(([level, price]) => (
                  <option key={level} value={level} className="bg-[#1a120b]">
                    {level.toUpperCase()} - £{price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Images (Dynamic based on selection) */}
            <div className="space-y-2">
              <label className="block text-sm text-white/80">Examples for {currentLevel}</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i, index) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer hover:opacity-90 transition"
                    onClick={() => {
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <img
                      src={`/${currentLevel}/img${i}.jpg`}
                      alt={`${currentLevel} example ${i}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Design Upload (Moved from Step 4) */}
            <div>
              <label className="block text-sm text-white/80 mb-1">Custom Design (Optional)</label>
              <div className="relative">
                <p className="text-xs text-[#E8B4A8] mb-2">Max file size: 2MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert('File size exceeds 2MB limit');
                        e.target.value = ''; // Reset input
                        setCustomDesignImage(null);
                      } else {
                        setCustomDesignImage(file);
                      }
                    } else {
                      setCustomDesignImage(null);
                    }
                  }}
                  className="w-full p-3 bg-[#4A3728] border border-[#E8B4A8]/30 rounded-xl text-white focus:border-[#E8B4A8] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E8B4A8] file:text-black hover:file:bg-[#D9A498]"
                />
              </div>
              <p className="text-xs text-white/50 mt-1">Upload an image of the design you want.</p>
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                // Ensure level/price are set before proceeding
                if (!selectedLevel) {
                   setSelectedLevel('level1');
                   setSelectedPrice(selectedService.prices['level1']);
                }
                setStep(2);
              }}
              className="w-full py-3 bg-[#E8B4A8] hover:bg-[#D9A498] text-black font-bold rounded-xl transition shadow-lg mt-4 flex items-center justify-center gap-2"
            >
              Next
            </button>
          </div>
        );

      case 2: // Date Selection
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white mb-4">Select a Date</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {schedule.filter(d => d.canBook).map((date) => (
                <button
                  key={date.date}
                  onClick={() => handleDateSelect(date)}
                  className="p-3 bg-[#4A3728] border border-[#E8B4A8]/30 rounded-xl hover:bg-[#E8B4A8]/10 transition text-center flex flex-col items-center gap-1"
                >
                  <span className="text-sm text-white/70">{new Date(date.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className="text-lg font-bold text-white">{new Date(date.date).getDate()}</span>
                  <span className="text-xs text-[#E8B4A8]">{date.type === 'full-day' ? 'Full Day' : `${date.slotsRemaining} slots`}</span>
                </button>
              ))}
              {schedule.filter(d => d.canBook).length === 0 && (
                <div className="col-span-full text-center text-white/50 py-8">No available dates found.</div>
              )}
            </div>
          </div>
        );

      case 3: // Time Selection
        if (!selectedDate) return null;
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white mb-4">Select Time for {selectedDate.displayDate}</h3>
            <div className="grid grid-cols-3 gap-3">
              {selectedDate.availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="p-3 border rounded-xl text-center transition bg-[#4A3728] border-[#E8B4A8]/30 text-white hover:bg-[#E8B4A8]/10"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        );

      case 4: // Contact Details
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">Your Details</h3>
            
            <div className="bg-[#4A3728]/50 p-4 rounded-xl border border-[#E8B4A8]/20 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Service:</span>
                <span className="text-white font-medium">{selectedService?.name} ({selectedLevel})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Date:</span>
                <span className="text-white font-medium">{selectedDate?.displayDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Time:</span>
                <span className="text-white font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                <span className="text-white/60">Price:</span>
                <span className="text-[#E8B4A8] font-bold">£{selectedPrice?.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-white/80 mb-1">Full Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-3 bg-[#4A3728] border border-[#E8B4A8]/30 rounded-xl text-white focus:border-[#E8B4A8] outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-2">Contact Method</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="email"
                      checked={contactMethod === 'email'}
                      onChange={() => setContactMethod('email')}
                      className="accent-[#E8B4A8] w-4 h-4"
                    />
                    <span className="text-white">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="phone"
                      checked={contactMethod === 'phone'}
                      onChange={() => setContactMethod('phone')}
                      className="accent-[#E8B4A8] w-4 h-4"
                    />
                    <span className="text-white">Phone Number</span>
                  </label>
                </div>

                {contactMethod === 'email' ? (
                  <div>
                    <label className="block text-sm text-white/80 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full p-3 bg-[#4A3728] border border-[#E8B4A8]/30 rounded-xl text-white focus:border-[#E8B4A8] outline-none"
                      placeholder="example@email.com"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-white/80 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full p-3 bg-[#4A3728] border border-[#E8B4A8]/30 rounded-xl text-white focus:border-[#E8B4A8] outline-none"
                      placeholder="+44 7123 456789"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!clientName || (contactMethod === 'email' ? !clientEmail : !clientPhone) || submitting}
              className="w-full py-3 bg-[#E8B4A8] hover:bg-[#D9A498] text-black font-bold rounded-xl transition shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
            </button>
          </div>
        );

      case 5: // Success
        return (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">Booking Confirmed!</h3>
            <p className="text-white/70">
              Thank you, {clientName}. Your appointment for {selectedService?.name} on {selectedDate?.displayDate} has been booked.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#E8B4A8] text-black rounded-xl font-medium hover:bg-[#D9A498] transition mt-4"
            >
              Close
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-[#1a120b] rounded-3xl shadow-2xl overflow-hidden border border-[#E8B4A8]/30 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E8B4A8]/20 bg-[#4A3728]/20">
              <div className="flex items-center gap-3">
                {step > 0 && step < 5 && (
                  <button onClick={goBack} className="p-1 hover:bg-white/10 rounded-full transition">
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-white">
                  {step === 5 ? 'Success' : 'Book Appointment'}
                </h2>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#E8B4A8] animate-spin" />
                </div>
              ) : (
                renderStepContent()
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selectedLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition z-50"
            >
              <X className="w-8 h-8" />
            </button>

            <div
              className="relative w-full max-w-4xl aspect-[4/5] sm:aspect-video flex items-center justify-center"
            >
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === 0 ? 2 : prev - 1));
                }}
                className="absolute left-2 sm:-left-12 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Image with Swipe */}
              <motion.img
                key={lightboxIndex}
                src={`/${selectedLevel}/img${lightboxIndex + 1}.jpg`}
                alt={`Level example ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;

                  if (swipe < -50) {
                    setLightboxIndex((prev) => (prev === 2 ? 0 : prev + 1));
                  } else if (swipe > 50) {
                    setLightboxIndex((prev) => (prev === 0 ? 2 : prev - 1));
                  }
                }}
              />

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === 2 ? 0 : prev + 1));
                }}
                className="absolute right-2 sm:-right-12 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Dots Indicator */}
              <div className="absolute -bottom-8 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === lightboxIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}