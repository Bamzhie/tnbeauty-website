// src/components/Hero.tsx
import heroImage from "../assets/20251119_205040.jpg";
import BookNowButton from './BookNowBtn';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#F5E6D3]">
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#4A3728] leading-tight">
              TNL Beauty
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#6B5344] font-light">
              Expert Nails,<br />Personal Touch
            </h2>
            <p className="text-[#8B7355] text-lg">
              Discover your perfect style today
            </p>

            {/* Reusable Button */}
            <BookNowButton />
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Beautiful manicured nails" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}