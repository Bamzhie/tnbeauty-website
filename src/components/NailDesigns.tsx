import { useState } from "react";
import { galleryImages } from "../data/images";
import GalleryModal from "./GalleryModal";
import { ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Show only the first 3 images on the main page
  const previewImages = galleryImages.slice(0, 3);

  const handlePreviewClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      handlePrevious();
    } else if (info.offset.x < -100) {
      handleNext();
    }
  };

  return (
    <section id="gallery" className="py-12 sm:py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-[#4A3728]">
          Gallery
        </h2>

        {/* Mobile: Horizontal Scroll | Desktop: Grid */}
        <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-auto md:px-0 custom-scrollbar">
          {previewImages.map((image, idx) => (
            <div
              key={idx}
              className="group cursor-pointer min-w-[240px] max-w-[280px] sm:min-w-[280px] sm:max-w-[320px] md:min-w-0 md:max-w-none snap-center flex-shrink-0"
              onClick={() => handlePreviewClick(idx)}
            >
              {/* Fixed image container */}
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg mb-3 sm:mb-4 aspect-square border-2 sm:border-4 border-white w-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        <div className="mt-6 sm:mt-8 text-center px-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#4A3728] text-[#E8B4A8] rounded-full font-medium hover:bg-[#3A2820] transition shadow-lg text-sm sm:text-base"
          >
            See More <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <GalleryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Lightbox for preview images */}
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
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
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
      </div>
    </section>
  );
}
