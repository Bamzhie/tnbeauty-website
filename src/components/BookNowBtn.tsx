// src/components/BookNowButton.tsx
import { useState } from 'react';
import BookAppointmentModal from './BookAppointmentModal';

interface BookNowButtonProps {
  className?: string;
}

export default function BookNowButton({ className = '' }: BookNowButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={`
          bg-[#E8B4A8] text-white px-8 py-3 rounded-full 
          hover:bg-[#D9A498] transition-all duration-300 
          shadow-lg text-sm font-medium
          ${className}
        `}
      >
        Book Your Nails
      </button>

      <BookAppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}