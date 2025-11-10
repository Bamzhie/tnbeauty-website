import floatImage from '../assets/float.jpg';

export default function Testimonials() {
  return (
    <section className="py-16 bg-[#FAF3EA]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#4A3728] mb-12">
          What our<br />clients say
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
          {/* Company Description */}
          <div className="space-y-4">
            <p className="text-[#6B5344] text-lg leading-relaxed">
              At TNL Beauty, we create experiences that exceed your expectations. Our expert technicians bring artistry and precision to every appointment.
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="bg-[#F5E6D3] rounded-3xl p-8 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-[#D9A498]">
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  S
                </div>
              </div>
              <div>
                <p className="text-[#4A3728] font-medium mb-2">
                  "Amazing designs, always impressed!"
                </p>
                <p className="text-[#8B7355] text-sm">- Sarah</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl overflow-hidden">
              <img 
                src={floatImage}
                alt="Nail design showcase"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}