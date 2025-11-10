import { Scissors, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="container mx-auto flex items-center justify-between py-4 px-4 absolute top-0 left-0 right-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Scissors className="w-6 h-6 text-[#8B6F5C] drop-shadow-md" />
        <span className="text-lg sm:text-xl font-bold text-[#8B6F5C] drop-shadow-md">TNL Beauty</span>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-medium text-[#8B6F5C] drop-shadow">
        <li className="hover:text-[#A0826D] transition cursor-pointer">Services</li>
        <li className="hover:text-[#A0826D] transition cursor-pointer">About Us</li>
        <li className="hover:text-[#A0826D] transition cursor-pointer">Gallery</li>
      </ul>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center space-x-3 lg:space-x-4 text-sm">
        <button className="border border-[#8B6F5C] text-[#8B6F5C] rounded-full px-4 py-1 hover:bg-[#8B6F5C] hover:text-white transition drop-shadow text-xs lg:text-sm">
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
              <li className="hover:text-[#A0826D] transition cursor-pointer">Services</li>
              <li className="hover:text-[#A0826D] transition cursor-pointer">About Us</li>
              <li className="hover:text-[#A0826D] transition cursor-pointer">Gallery</li>
            </ul>
            <div className="mt-6 flex flex-col items-center space-y-3">
              <button className="w-full border border-[#8B6F5C] text-[#8B6F5C] rounded-full py-2 hover:bg-[#8B6F5C] hover:text-white transition">
                CONTACT US
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}