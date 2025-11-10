// src/components/BookAppointmentModal.tsx
import { X, ChevronDown, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  thumbnails: string[];
}

const services: Service[] = [
  {
    id: 'gel-x',
    name: 'Gel‑x',
    price: '£40',
    duration: '1h 15m',
    thumbnails: ['/thumbs/gelx-1.jpg', '/thumbs/gelx-2.jpg', '/thumbs/gelx-3.jpg'],
  },
  {
    id: 'acrylic',
    name: 'Acrylic',
    price: '£45',
    duration: '1h 30m',
    thumbnails: ['/thumbs/acrylic-1.jpg', '/thumbs/acrylic-2.jpg', '/thumbs/acrylic-3.jpg'],
  },
  {
    id: 'biab',
    name: 'Biab',
    price: '£38',
    duration: '1h 10m',
    thumbnails: ['/thumbs/biab-1.jpg', '/thumbs/biab-2.jpg', '/thumbs/biab-3.jpg'],
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    price: '£35',
    duration: '1h 00m',
    thumbnails: ['/thumbs/pedi-1.jpg', '/thumbs/pedi-2.jpg', '/thumbs/pedi-3.jpg'],
  },
  {
    id: 'gel-manicure',
    name: 'Gel Manicure',
    price: '£30',
    duration: '1h 00m',
    thumbnails: ['/thumbs/gel-1.jpg', '/thumbs/gel-2.jpg', '/thumbs/gel-3.jpg'],
  },

];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookAppointmentModal({ isOpen, onClose }: Props) {
  const [selectedService, setSelectedService] = useState<Service>(services[0]); // Gel‑x default
  const [currentThumb, setCurrentThumb] = useState(0);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = services.find(s => s.id === e.target.value);
    if (service) {
      setSelectedService(service);
      setCurrentThumb(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#4A3728] rounded-3xl shadow-2xl overflow-hidden border border-[#E8B4A8]/30"
          >
            <div className="flex items-center justify-between p-5 border-b border-[#E8B4A8]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E8B4A8] flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Book Appointment</h2>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 border-b border-[#E8B4A8]/20">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Service
              </label>
              <div className="relative">
                <select
                  value={selectedService.id}
                  onChange={handleServiceChange}
                  className={`
                    w-full appearance-none bg-[#4A3728] border border-[#E8B4A8]/40
                    rounded-xl px-4 py-3 text-white pr-10
                    focus:outline-none focus:border-[#E8B4A8] focus:bg-[#4A3728]/90
                    transition-all duration-200 text-sm
                  `}
                  style={{
                    backgroundColor: '#4A3728',
                    color: 'white',
                  }}
                >
                  {services.map(service => (
                    <option
                      key={service.id}
                      value={service.id}
                      className="bg-[#4A3728] text-white hover:bg-[#E8B4A8] hover:text-black"
                    >
                      {service.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E8B4A8] pointer-events-none" />
              </div>
            </div>

            <div className="px-6 py-4 border-b border-[#E8B4A8]/20">
              <div className="flex gap-6 text-sm">
                <span className="text-white/70">
                  Price: <span className="font-medium text-white">{selectedService.price}</span>
                </span>
                <span className="text-white/70">
                  Duration: <span className="font-medium text-white">{selectedService.duration}</span>
                </span>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center justify-center gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
                {selectedService.thumbnails.map((src, i) => (
                  <div
                    key={i}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden snap-center transition-all border-2 ${
                      currentThumb === i ? 'border-[#E8B4A8]' : 'border-transparent'
                    }`}
                  >
                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-xs text-white/60">
                      {src.split('/').pop()?.replace('.jpg', '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E8B4A8]/20">
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#E8B4A8] hover:bg-[#D9A498] rounded-xl text-black text-sm font-medium transition">
                <Upload className="w-4 h-4" />
                Upload Your Own Inspo
              </button>
            </div>

            <div className="px-6 pb-6 pt-2">
              <button className="w-full py-3 bg-[#E8B4A8] hover:bg-[#D9A498] text-black font-bold rounded-xl transition shadow-lg">
                [ Next ]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}