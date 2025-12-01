import { Scissors, Menu, X, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToGallery = () => {
    const gallerySection = document.getElementById("gallery");

    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
    setIsOpen(false);
  };

  const goToServices = () => {
    navigate("/services");
    setIsOpen(false);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 absolute top-0 left-0 right-0 z-50">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Scissors className="w-6 h-6 text-[#8B6F5C] drop-shadow-md" />
          <span className="text-lg sm:text-xl font-bold text-[#8B6F5C] drop-shadow-md">
            TNL Beauty
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-medium text-[#8B6F5C] drop-shadow">
          <li
            onClick={goToServices}
            className="hover:text-[#A0826D] transition cursor-pointer"
          >
            Services
          </li>
          <li
            onClick={scrollToGallery}
            className="hover:text-[#A0826D] transition cursor-pointer"
          >
            Gallery
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4 text-sm">
          <button
            onClick={openContactModal}
            className="border border-[#8B6F5C] text-[#8B6F5C] rounded-full px-4 py-1 hover:bg-[#8B6F5C] hover:text-white transition drop-shadow text-xs lg:text-sm"
          >
            CONTACT US
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#8B6F5C]"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 md:hidden">
            <div className="bg-white/95 backdrop-blur-lg shadow-2xl p-6 transition-all duration-300">
              <ul className="space-y-4 text-center text-[#8B6F5C] font-medium">
                <li
                  onClick={goToServices}
                  className="hover:text-[#A0826D] transition cursor-pointer"
                >
                  Services
                </li>
                <li
                  onClick={scrollToGallery}
                  className="hover:text-[#A0826D] transition cursor-pointer"
                >
                  Gallery
                </li>
              </ul>
              <div className="mt-6 flex flex-col items-center space-y-3">
                <button
                  onClick={openContactModal}
                  className="w-full border border-[#8B6F5C] text-[#8B6F5C] rounded-full py-2 hover:bg-[#8B6F5C] hover:text-white transition"
                >
                  CONTACT US
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#4A3728]">
                  Contact Us
                </h2>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="text-[#8B6F5C] hover:text-[#4A3728] transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#E8B4A8] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#8B7355] mb-1">Email</p>
                    <a
                      href="mailto:info@tnlbeauty.com"
                      className="text-[#4A3728] hover:text-[#E8B4A8] transition font-medium"
                    >
                      info@tnlbeauty.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#E8B4A8] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#8B7355] mb-1">Phone</p>
                    <a
                      href="tel:+447123456789"
                      className="text-[#4A3728] hover:text-[#E8B4A8] transition font-medium"
                    >
                      +44 7123 456789
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E8B4A8] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#8B7355] mb-1">Address</p>
                    <p className="text-[#4A3728] font-medium">
                      123 Beauty Lane
                      <br />
                      London, UK
                      <br />
                      SW1A 1AA
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
