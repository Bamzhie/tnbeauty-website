import floatImage from '../assets/float.jpg';
import heroImage from '../assets/hero.jpg';

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
      quote: "I love the attention to detail. My nails look flawless every time!",
      author: "Amaka",
      initial: "A",
      image: floatImage,
    },
  ];

  return (
    <section className="py-16 bg-[#FAF3EA]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#4A3728] mb-12 text-center">
          What our<br />clients say
        </h2>

        <p className="text-[#6B5344] text-lg leading-relaxed text-center max-w-3xl mx-auto mb-12">
          At TNL Beauty, we create experiences that exceed your expectations. Our expert technicians bring artistry and precision to every appointment.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-[#E8D5C4] rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 bg-[#D9A498] flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl font-bold">
                    {testimonial.initial}
                  </span>
                </div>
                <div>
                  <p className="text-[#4A3728] font-medium mb-2 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-[#8B7355] text-sm">- {testimonial.author}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={testimonial.image}
                  alt={`Nail design by ${testimonial.author}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}