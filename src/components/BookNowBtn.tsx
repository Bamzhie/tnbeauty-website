// src/components/BookNowButton.tsx
import { useNavigate } from 'react-router-dom';

interface BookNowButtonProps {
  className?: string;
}

export default function BookNowButton({ className = '' }: BookNowButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/book')}
      className={`
        bg-[#E8B4A8] text-white px-8 py-3 rounded-full 
        hover:bg-[#D9A498] transition-all duration-300 
        shadow-lg text-sm font-medium
        ${className}
      `}
    >
      Book Your Nails
    </button>
  );
}