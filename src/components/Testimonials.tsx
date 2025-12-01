import { useState, useEffect } from "react";
import floatImage from "../assets/float.webp";
import heroImage from "../assets/hero.webp";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Amazing designs, always impressed!",
      author: "Sarah",
      initial: "S",
      image: floatImage,
    },
    {
      quote: "Best nail salon in town! Professional and creative.",
      author: "Jessica",
      initial: "J",
      image: heroImage,
    },
    {
      quote:
        "I love the attention to detail. My nails look flawless every time!",
      author: "Amaka",
      initial: "A",
      image: floatImage,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle touch events for swipe
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
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section className="py-12 sm:py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#4A3728] mb-6 sm:mb-8 md:mb-12 text-center">
          What our
          <br />
          clients say
        </h2>

        <p className="text-[#6B5344] text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 px-4">
          At TNL Beauty, we create experiences that exceed your expectations.
          Our expert technicians bring artistry and precision to every
          appointment.
        </p>

        {/* Mobile/Tablet Carousel (up to 768px) */}
        {isMobile ? (
          <div className="relative max-w-sm sm:max-w-md mx-auto">
            {/* Carousel Container with touch support */}
            <div
              className="overflow-hidden cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="w-full flex-shrink-0 px-2">
                    <div className="bg-[#E8D5C4] rounded-2xl p-5 sm:p-6 shadow-lg mx-auto select-none">
                      {/* Image at the top - reduced height */}
                      <div
                        className="rounded-xl overflow-hidden shadow-md w-full mb-4 sm:mb-5"
                        style={{ height: "200px" }}
                      >
                        <img
                          src={testimonial.image}
                          alt={`Nail design by ${testimonial.author}`}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      </div>

                      {/* Comment section */}
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#D9A498] flex items-center justify-center">
                          <span className="text-white text-base sm:text-lg font-bold">
                            {testimonial.initial}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#4A3728] font-medium mb-1.5 sm:mb-2 leading-relaxed text-sm sm:text-base">
                            "{testimonial.quote}"
                          </p>
                          <p className="text-[#8B7355] text-xs sm:text-sm">
                            - {testimonial.author}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-5 sm:mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-[#4A3728] w-6"
                      : "bg-[#4A3728]/30"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Desktop Grid (above 768px) */
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-[#E8D5C4] rounded-3xl p-6 lg:p-8 shadow-lg flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4 flex-1">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden flex-shrink-0 bg-[#D9A498] flex items-center justify-center">
                    <span className="text-white text-xl lg:text-2xl font-bold">
                      {testimonial.initial}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#4A3728] font-medium mb-2 leading-relaxed text-base">
                      "{testimonial.quote}"
                    </p>
                    <p className="text-[#8B7355] text-sm">
                      - {testimonial.author}
                    </p>
                  </div>
                </div>

                {/* Fixed image container */}
                <div className="mt-6 rounded-2xl overflow-hidden shadow-md aspect-square w-full">
                  <img
                    src={testimonial.image}
                    alt={`Nail design by ${testimonial.author}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
