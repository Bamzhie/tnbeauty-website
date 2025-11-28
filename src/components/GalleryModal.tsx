import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryImages } from '../data/images';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function GalleryModal({ isOpen, onClose }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Touch event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      handleNext({} as React.MouseEvent);
    }
    if (isRightSwipe) {
      handlePrevious({} as React.MouseEvent);
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#1a120b] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#E8B4A8]/30 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E8B4A8]/20 bg-[#4A3728]/20">
              <h2 className="text-lg sm:text-xl font-bold text-white">Gallery</h2>
              <button onClick={onClose} className="text-white/70 hover:text-white transition">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content - Fixed for mobile */}
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar overscroll-contain">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {galleryImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="rounded-xl overflow-hidden aspect-square shadow-md hover:opacity-90 transition w-full cursor-pointer"
                    onClick={() => handleImageClick(idx)}
                  >
                    <img 
                      src={img.src} 
                      alt={img.alt} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setLightboxOpen(false)}
              >
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="absolute top-4 right-4 z-[210] text-white/70 hover:text-white transition"
                >
                  <X className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>

                <div className="relative w-full max-w-4xl aspect-[4/5] sm:aspect-video flex items-center justify-center">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevious}
                    className="absolute left-2 sm:left-4 z-[210] bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 rounded-full transition backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Image */}
                  <motion.img
                    key={lightboxIndex}
                    src={galleryImages[lightboxIndex].src}
                    alt={galleryImages[lightboxIndex].alt}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  />

                  {/* Next Button */}
                  <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-4 z-[210] bg-white/10 hover:bg-white/20 text-white p-2 sm:p-3 rounded-full transition backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {lightboxIndex + 1} / {galleryImages.length}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}