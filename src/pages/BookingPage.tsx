import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Check, Trash2, Calendar as CalendarIcon, Clock, Loader2, ChevronLeft, ChevronRight, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { coreServices, addOns, removals, nailArtLevels, calculateTotalPrice, getSelectedServiceNames } from '../data/services';
import { getPublicBookingData, createBooking, type AvailableDate } from '../services/api';

// Helper to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to get day of week for first day of month (0-6, 0=Sun)
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export default function BookingPage() {
  const navigate = useNavigate();
  
  // --- State Management ---
  
  // Accordion & Visibility State
  const [expandedSection, setExpandedSection] = useState<number>(0); // 0: Treatments, 1: Date/Time, 2: Contact
  const [visibleSections, setVisibleSections] = useState<number[]>([0]); // Only first section visible initially
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [processingStep, setProcessingStep] = useState<number | null>(null); // Track which step is "loading"

  // Data State
  const [schedule, setSchedule] = useState<AvailableDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Selection State (with persistence initialization)
  const [selectedCoreServices, setSelectedCoreServices] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('booking_coreServices') || '[]')
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('booking_addOns') || '[]')
  );
  const [selectedNailArtLevel, setSelectedNailArtLevel] = useState<string | null>(() => 
    localStorage.getItem('booking_nailArtLevel')
  );
  const [selectedRemovals, setSelectedRemovals] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('booking_removals') || '[]')
  );
  const [showRemovalDropdown, setShowRemovalDropdown] = useState(false);
  
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(() => 
    localStorage.getItem('booking_date')
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(() => 
    localStorage.getItem('booking_time')
  );
  
  const [clientName, setClientName] = useState(() => localStorage.getItem('booking_name') || '');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>(() => 
    (localStorage.getItem('booking_contactMethod') as 'email' | 'phone') || 'email'
  );
  const [clientEmail, setClientEmail] = useState(() => localStorage.getItem('booking_email') || '');
  const [clientPhone, setClientPhone] = useState(() => localStorage.getItem('booking_phone') || '');

  // File Upload State (not persisted in localStorage)
  const [inspoImage, setInspoImage] = useState<File | null>(null);

  // Calendar View State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- Effects ---

  // Fetch Schedule
  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const data = await getPublicBookingData();
      setSchedule(data.availableDates);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  // Persistence Effects
  useEffect(() => localStorage.setItem('booking_coreServices', JSON.stringify(selectedCoreServices)), [selectedCoreServices]);
  useEffect(() => localStorage.setItem('booking_addOns', JSON.stringify(selectedAddOns)), [selectedAddOns]);
  useEffect(() => {
    if (selectedNailArtLevel) localStorage.setItem('booking_nailArtLevel', selectedNailArtLevel);
    else localStorage.removeItem('booking_nailArtLevel');
  }, [selectedNailArtLevel]);
  useEffect(() => localStorage.setItem('booking_removals', JSON.stringify(selectedRemovals)), [selectedRemovals]);
  useEffect(() => {
    if (selectedDateStr) localStorage.setItem('booking_date', selectedDateStr);
    else localStorage.removeItem('booking_date');
  }, [selectedDateStr]);
  useEffect(() => {
    if (selectedTime) localStorage.setItem('booking_time', selectedTime);
    else localStorage.removeItem('booking_time');
  }, [selectedTime]);
  useEffect(() => localStorage.setItem('booking_name', clientName), [clientName]);
  useEffect(() => localStorage.setItem('booking_contactMethod', contactMethod), [contactMethod]);
  useEffect(() => localStorage.setItem('booking_email', clientEmail), [clientEmail]);
  useEffect(() => localStorage.setItem('booking_phone', clientPhone), [clientPhone]);

  // Clear persistence on success
  const clearPersistence = () => {
    localStorage.removeItem('booking_coreServices');
    localStorage.removeItem('booking_addOns');
    localStorage.removeItem('booking_nailArtLevel');
    localStorage.removeItem('booking_removals');
    localStorage.removeItem('booking_date');
    localStorage.removeItem('booking_time');
    localStorage.removeItem('booking_name');
    localStorage.removeItem('booking_contactMethod');
    localStorage.removeItem('booking_email');
    localStorage.removeItem('booking_phone');
  };

  // --- Computed Values ---

  const totalPrice = calculateTotalPrice(selectedCoreServices, selectedAddOns, selectedRemovals, selectedNailArtLevel);
  const selectedServicesList = getSelectedServiceNames(selectedCoreServices, selectedAddOns, selectedRemovals, selectedNailArtLevel);
  
  const selectedDateObj = useMemo(() => 
    schedule.find(d => d.date === selectedDateStr), 
  [schedule, selectedDateStr]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDateObj) return [];
    if (selectedDateObj.type === 'full-day') {
      const slots = [];
      for (let i = 10; i <= 18; i++) slots.push(`${i.toString().padStart(2, '0')}:00`);
      return slots;
    }
    return selectedDateObj.availableSlots;
  }, [selectedDateObj]);

  // --- Handlers ---

  const handleAddService = (type: 'core' | 'addon' | 'removal', id: string) => {
    if (!id) return;
    if (type === 'core') {
      if (!selectedCoreServices.includes(id)) setSelectedCoreServices([...selectedCoreServices, id]);
    } else if (type === 'addon') {
      if (!selectedAddOns.includes(id)) setSelectedAddOns([...selectedAddOns, id]);
    } else if (type === 'removal') {
      if (!selectedRemovals.includes(id)) setSelectedRemovals([...selectedRemovals, id]);
    }
  };

  const handleRemoveService = (type: 'core' | 'addon' | 'removal' | 'nailArt', id: string) => {
    if (type === 'core') setSelectedCoreServices(prev => prev.filter(s => s !== id));
    else if (type === 'addon') setSelectedAddOns(prev => prev.filter(s => s !== id));
    else if (type === 'removal') setSelectedRemovals(prev => prev.filter(s => s !== id));
    else if (type === 'nailArt') setSelectedNailArtLevel(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInspoImage(e.target.files[0]);
    }
  };

  const handleNext = (currentSection: number) => {
    setProcessingStep(currentSection);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      if (!completedSections.includes(currentSection)) {
        setCompletedSections([...completedSections, currentSection]);
      }
      
      const nextSection = currentSection + 1;
      if (!visibleSections.includes(nextSection)) {
        setVisibleSections([...visibleSections, nextSection]);
      }
      
      setExpandedSection(nextSection);
      setProcessingStep(null);
    }, 600);
  };

  const toggleSection = (section: number) => {
    // Only allow toggling if section is visible
    if (!visibleSections.includes(section)) return;
    
    if (section < expandedSection || completedSections.includes(section - 1) || section === 0) {
      setExpandedSection(expandedSection === section ? -1 : section);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDateObj || !clientName) return;
    if (contactMethod === 'email' && !clientEmail) return;
    if (contactMethod === 'phone' && !clientPhone) return;

    setSubmitting(true);
    try {
      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append('name', clientName);
      if (contactMethod === 'email' && clientEmail) formData.append('email', clientEmail);
      if (contactMethod === 'phone' && clientPhone) formData.append('phone', clientPhone);
      formData.append('date', selectedDateObj.displayDate);
      if (selectedTime) formData.append('time', selectedTime);

      // Append arrays - need to be careful with how backend expects them
      // NestJS FileInterceptor with JSON body usually works if we stringify or append individually
      // But since we updated backend to accept arrays, let's append them individually
      
      // Core Services
      selectedCoreServices.forEach(id => {
        const name = coreServices.find(s => s.id === id)?.name;
        if (name) formData.append('coreServices', name);
      });

      // Addons (including nail art level if selected)
      selectedAddOns.forEach(id => {
        const name = addOns.find(a => a.id === id)?.name;
        if (name) formData.append('addons', name);
      });
      if (selectedNailArtLevel) {
        const level = nailArtLevels.find(l => l.id === selectedNailArtLevel);
        if (level) formData.append('addons', level.name);
      }

      // Removals
      selectedRemovals.forEach(id => {
        const name = removals.find(r => r.id === id)?.name;
        if (name) formData.append('removals', name);
      });

      if (inspoImage) {
        formData.append('customDesignImage', inspoImage);
      }

      await createBooking(formData);
      clearPersistence();
      setBookingSuccess(true);
    } catch (error: any) {
      alert('Booking failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  // --- Render Helpers ---
  
  const renderSummary = (showDate = false) => (
    <div className="bg-[#FAF6F3] p-4 rounded-xl border border-[#E8D5C4] space-y-4 mt-4">
      <h4 className="font-bold text-[#4A3728] border-b border-[#E8D5C4] pb-2 text-sm uppercase tracking-wide">Current Booking Summary</h4>
      
      {/* Services List */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-[#8B7355] uppercase tracking-wider">Treatments</p>
        {selectedServicesList.length > 0 ? (
          <div className="space-y-1">
            {selectedServicesList.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-[#4A3728]">{item.name}</span>
                <span className="font-medium text-[#4A3728]">£{item.price}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No treatments selected</p>
        )}
      </div>

      {/* Date & Time (Conditional) */}
      {showDate && (
        <div className="space-y-2">
           <p className="text-xs font-bold text-[#8B7355] uppercase tracking-wider">Date & Time</p>
           <div className="flex justify-between text-sm">
             <span className="text-[#4A3728]">Date</span>
             <span className="font-medium text-[#4A3728]">
               {selectedDateStr ? new Date(selectedDateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
             </span>
           </div>
           <div className="flex justify-between text-sm">
             <span className="text-[#4A3728]">Time</span>
             <span className="font-medium text-[#4A3728]">{selectedTime || '-'}</span>
           </div>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t border-[#E8D5C4]">
        <span className="font-bold text-[#4A3728] text-lg">Total Estimate</span>
        <span className="font-black text-[#4A3728] text-2xl">£{totalPrice}</span>
      </div>
    </div>
  );

  // --- Calendar Logic ---
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month); // 0=Sun
    
    const startDay = firstDay === 0 ? 6 : firstDay - 1; 

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 md:h-12"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isAvailable = schedule.some(d => d.date === dateStr && d.canBook);
      const isSelected = selectedDateStr === dateStr;
      const availableDate = schedule.find(d => d.date === dateStr);

      days.push(
        <button
          key={dateStr}
          disabled={!isAvailable}
          onClick={() => {
            setSelectedDateStr(dateStr);
            setSelectedTime(null); // Reset time on date change
          }}
          className={`h-10 md:h-12 rounded-lg flex items-center justify-center text-sm font-medium transition relative
            ${isSelected 
              ? 'bg-[#4A3728] text-white shadow-lg scale-105 z-10' 
              : isAvailable 
                ? 'bg-white border-2 border-[#E8B4A8] text-[#4A3728] hover:bg-[#E8B4A8] hover:text-white font-bold shadow-sm' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          {day}
          {isAvailable && availableDate?.type === 'timed' && (
            <span className="absolute bottom-0.5 right-1 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          )}
        </button>
      );
    }

    return days;
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] py-12 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-[#4A3728] mb-4">Booking Confirmed!</h2>
          <p className="text-[#6B5344] mb-6">
            Thank you, {clientName}! Your appointment has been successfully requested. We've sent a confirmation email to you.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-[#4A3728] text-white font-bold rounded-xl hover:bg-[#3A2B20] transition"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5E6D3] py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#4A3728] hover:text-[#6B5344] transition font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A3728]">
            Book Appointment
          </h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          
          {/* Section 1: Treatments */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection(0)}
              className={`w-full p-6 flex items-center justify-between transition ${expandedSection === 0 ? 'bg-[#4A3728] text-white' : 'bg-white text-[#4A3728]'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${expandedSection === 0 ? 'bg-white text-[#4A3728]' : 'bg-[#E8D5C4] text-[#4A3728]'}`}>
                  1
                </div>
                <span className="text-xl font-bold">Treatments</span>
              </div>
              {expandedSection === 0 ? <ChevronUp /> : <ChevronDown />}
            </button>

            <AnimatePresence>
              {expandedSection === 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-6 space-y-8">
                    
                    {/* Core Services Dropdown */}
                    <div>
                      <label className="block text-sm font-bold text-[#4A3728] mb-2">Add Core Service</label>
                      <select 
                        className="w-full p-3 rounded-xl border-2 border-[#E8D5C4] focus:border-[#4A3728] outline-none bg-white text-[#4A3728]"
                        onChange={(e) => {
                          handleAddService('core', e.target.value);
                          e.target.value = '';
                        }}
                      >
                        <option value="">Select a service...</option>
                        {coreServices.map(s => (
                          <option key={s.id} value={s.id} disabled={selectedCoreServices.includes(s.id)}>
                            {s.name} (£{s.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Add-ons Dropdown */}
                    <div>
                      <label className="block text-sm font-bold text-[#4A3728] mb-2">Add Add-ons (Optional)</label>
                      <select 
                        className="w-full p-3 rounded-xl border-2 border-[#E8D5C4] focus:border-[#4A3728] outline-none bg-white text-[#4A3728]"
                        onChange={(e) => {
                          handleAddService('addon', e.target.value);
                          e.target.value = '';
                        }}
                      >
                        <option value="">Select an add-on...</option>
                        {addOns.map(s => (
                          <option key={s.id} value={s.id} disabled={selectedAddOns.includes(s.id)}>
                            {s.name} (£{s.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Nail Art Levels - Dropdown Selection */}
                    <div>
                      <label className="block text-sm font-bold text-[#4A3728] mb-2">Select Nail Art Level (Optional)</label>
                      <select 
                        className="w-full p-3 rounded-xl border-2 border-[#E8D5C4] focus:border-[#4A3728] outline-none bg-white text-[#4A3728]"
                        value={selectedNailArtLevel || ''}
                        onChange={(e) => setSelectedNailArtLevel(e.target.value || null)}
                      >
                        <option value="">No Nail Art</option>
                        {nailArtLevels.map(level => (
                          <option key={level.id} value={level.id}>
                            {level.name} (£{level.price})
                          </option>
                        ))}
                      </select>

                      {/* Example Images for Selected Level */}
                      <AnimatePresence>
                        {selectedNailArtLevel && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4"
                          >
                            <p className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">Examples of {nailArtLevels.find(l => l.id === selectedNailArtLevel)?.name}</p>
                            
                            {/* Conditional Layout: Carousel if > 3 images, Grid if <= 3 */}
                            {(() => {
                              const images = nailArtLevels.find(l => l.id === selectedNailArtLevel)?.exampleImages || [];
                              const isCarousel = images.length > 3;

                              return (
                                <div className={
                                  isCarousel 
                                    ? "flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible md:pb-0" 
                                    : "grid grid-cols-3 md:grid-cols-4 gap-2"
                                }>
                                  {images.map((img, idx) => (
                                    <div 
                                      key={idx} 
                                      className={`aspect-square rounded-lg overflow-hidden border border-[#E8D5C4] flex-shrink-0 ${isCarousel ? 'w-1/3 md:w-auto snap-center' : 'w-full'}`}
                                    >
                                      <img src={img} alt={`Example ${idx + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                            
                            <p className="text-xs text-[#6B5344] mt-2 italic">
                              {nailArtLevels.find(l => l.id === selectedNailArtLevel)?.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Upload Inspo */}
                      <div className="mt-4">
                        <label className="block text-sm font-bold text-[#4A3728] mb-2">Upload Inspiration (Optional)</label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2 border-2 border-[#E8D5C4] rounded-xl cursor-pointer hover:bg-[#FAF6F3] transition text-[#4A3728]">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm font-medium">Choose Image</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                          </label>
                          {inspoImage && (
                            <div className="flex items-center gap-2 bg-[#E8D5C4] px-3 py-1 rounded-lg">
                              <span className="text-xs text-[#4A3728] truncate max-w-[150px]">{inspoImage.name}</span>
                              <button onClick={() => setInspoImage(null)} className="text-[#4A3728] hover:text-red-500">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Removals - Conditional */}
                    <div className="pt-4 border-t border-[#E8D5C4]">
                      <label className="flex items-center gap-2 cursor-pointer mb-4">
                        <input 
                          type="checkbox" 
                          checked={showRemovalDropdown}
                          onChange={(e) => {
                            setShowRemovalDropdown(e.target.checked);
                            if (!e.target.checked) setSelectedRemovals([]); // Clear removals if unchecked
                          }}
                          className="w-4 h-4 text-[#4A3728] rounded focus:ring-[#4A3728]"
                        />
                        <span className="text-sm font-bold text-[#4A3728]">Need a removal?</span>
                      </label>

                      <AnimatePresence>
                        {showRemovalDropdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <select 
                              className="w-full p-3 rounded-xl border-2 border-[#E8D5C4] focus:border-[#4A3728] outline-none bg-white text-[#4A3728]"
                              onChange={(e) => {
                                handleAddService('removal', e.target.value);
                                e.target.value = '';
                              }}
                            >
                              <option value="">Select a removal...</option>
                              {removals.map(s => (
                                <option key={s.id} value={s.id} disabled={selectedRemovals.includes(s.id)}>
                                  {s.name} (£{s.price})
                                </option>
                              ))}
                            </select>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Selected List */}
                    {selectedServicesList.length > 0 && (
                      <div className="bg-[#FAF6F3] rounded-xl p-4 space-y-3">
                        <h3 className="font-bold text-[#4A3728] text-sm uppercase tracking-wide">Selected Items</h3>
                        {selectedServicesList.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-[#E8D5C4]">
                            <div>
                              <span className="font-medium text-[#4A3728] block">{item.name}</span>
                              <span className="text-[#8B7355] text-sm">£{item.price}</span>
                            </div>
                            <button 
                              onClick={() => handleRemoveService(
                                coreServices.some(s => s.name === item.name) ? 'core' : 
                                addOns.some(s => s.name === item.name) ? 'addon' : 
                                nailArtLevels.some(s => s.name === item.name) ? 'nailArt' : 'removal',
                                [...coreServices, ...addOns, ...nailArtLevels, ...removals].find(s => s.name === item.name)?.id || ''
                              )}
                              className="text-red-400 hover:text-red-600 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        <div className="flex justify-between items-center pt-3 border-t border-[#E8D5C4]">
                          <span className="font-bold text-[#4A3728] text-lg">Total Estimate</span>
                          <span className="font-black text-[#4A3728] text-2xl">£{totalPrice}</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleNext(0)}
                      disabled={selectedCoreServices.length === 0 || processingStep === 0}
                      className="w-full py-4 bg-[#4A3728] text-white font-bold rounded-xl hover:bg-[#3A2B20] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-2"
                    >
                      {processingStep === 0 ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Next'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Summary when collapsed */}
            {expandedSection !== 0 && selectedServicesList.length > 0 && (
              <div className="px-6 pb-6 pt-0">
                <p className="text-[#6B5344] text-sm">
                  {selectedServicesList.length} items selected • <span className="font-bold">£{totalPrice}</span>
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Date & Time */}
          {visibleSections.includes(1) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleSection(1)}
                disabled={!completedSections.includes(0)}
                className={`w-full p-6 flex items-center justify-between transition ${expandedSection === 1 ? 'bg-[#4A3728] text-white' : 'bg-white text-[#4A3728]'} disabled:opacity-60`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${expandedSection === 1 ? 'bg-white text-[#4A3728]' : 'bg-[#E8D5C4] text-[#4A3728]'}`}>
                    2
                  </div>
                  <span className="text-xl font-bold">Date & Time</span>
                </div>
                {expandedSection === 1 ? <ChevronUp /> : <ChevronDown />}
              </button>

              <AnimatePresence>
                {expandedSection === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-6 space-y-6">
                      
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                        <h3 className="font-bold text-[#4A3728] text-lg">
                          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="w-5 h-5" /></button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-2 mb-6">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="text-center text-xs font-bold text-[#8B7355] uppercase py-2">
                            {day}
                          </div>
                        ))}
                        {renderCalendar()}
                      </div>

                      {/* Time Selection */}
                      {selectedDateStr && (
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-[#4A3728]">Select Time</label>
                          <select
                            value={selectedTime || ''}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-[#E8D5C4] focus:border-[#4A3728] outline-none bg-white text-[#4A3728]"
                          >
                            <option value="">Choose a time...</option>
                            {availableTimeSlots.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Cumulative Summary */}
                      {renderSummary(false)}

                      <button
                        onClick={() => handleNext(1)}
                        disabled={!selectedDateStr || !selectedTime || processingStep === 1}
                        className="w-full py-4 bg-[#4A3728] text-white font-bold rounded-xl hover:bg-[#3A2B20] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-2"
                      >
                        {processingStep === 1 ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Next'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary when collapsed */}
              {expandedSection !== 1 && selectedDateStr && selectedTime && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-[#6B5344] text-sm">
                    {new Date(selectedDateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at {selectedTime}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Section 3: Contact Details */}
          {visibleSections.includes(2) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleSection(2)}
                disabled={!completedSections.includes(1)}
                className={`w-full p-6 flex items-center justify-between transition ${expandedSection === 2 ? 'bg-[#4A3728] text-white' : 'bg-white text-[#4A3728]'} disabled:opacity-60`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${expandedSection === 2 ? 'bg-white text-[#4A3728]' : 'bg-[#E8D5C4] text-[#4A3728]'}`}>
                    3
                  </div>
                  <span className="text-xl font-bold">Contact Details</span>
                </div>
                {expandedSection === 2 ? <ChevronUp /> : <ChevronDown />}
              </button>

              <AnimatePresence>
                {expandedSection === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-6 space-y-6">
                      
                      <div>
                        <label className="block text-sm font-bold text-[#4A3728] mb-2">Full Name</label>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full p-3 border-2 border-[#E8D5C4] rounded-xl focus:border-[#4A3728] outline-none"
                          placeholder="Your Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#4A3728] mb-2">Preferred Contact Method</label>
                        <div className="flex gap-4 mb-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              checked={contactMethod === 'email'}
                              onChange={() => setContactMethod('email')}
                              className="w-4 h-4 text-[#4A3728] focus:ring-[#4A3728]"
                            />
                            <span className="text-[#4A3728]">Email</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              checked={contactMethod === 'phone'}
                              onChange={() => setContactMethod('phone')}
                              className="w-4 h-4 text-[#4A3728] focus:ring-[#4A3728]"
                            />
                            <span className="text-[#4A3728]">Phone (WhatsApp)</span>
                          </label>
                        </div>

                        {contactMethod === 'email' ? (
                          <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full p-3 border-2 border-[#E8D5C4] rounded-xl focus:border-[#4A3728] outline-none"
                            placeholder="your@email.com"
                          />
                        ) : (
                          <input
                            type="tel"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full p-3 border-2 border-[#E8D5C4] rounded-xl focus:border-[#4A3728] outline-none"
                            placeholder="07123 456789"
                          />
                        )}
                      </div>

                      {/* Full Summary including Date */}
                      {renderSummary(true)}

                      <button
                        onClick={handleSubmit}
                        disabled={submitting || !clientName || (contactMethod === 'email' ? !clientEmail : !clientPhone)}
                        className="w-full py-4 bg-[#4A3728] text-white font-bold rounded-xl hover:bg-[#3A2B20] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Confirm Booking'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
