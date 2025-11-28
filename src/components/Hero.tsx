// src/components/Hero.tsx
import heroImage from "../assets/20251119_205040.jpg";
import BookNowButton from './BookNowBtn';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-end md:items-center bg-[#d6d3cd]">
      <div className="container mx-auto md:px-6 pt-12 pb-0 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 px-6 md:px-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#171716] leading-tight">
              TNL Beauty
            </h1>


            {/* Reusable Button */}
            <BookNowButton />
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-none md:rounded-3xl overflow-hidden shadow-none md:shadow-2xl">
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