import floatImage from '../assets/float.jpg';
import heroImage from '../assets/hero.jpg';

export default function NailDesigns() {
  const designs = [
    { name: 'Gel Art', image: floatImage },
    { name: 'Acrylic Set', image: heroImage },
    { name: 'Nail Art', image: floatImage }
  ];

  return (
    <section className="py-16 bg-[#FAF3EA]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#4A3728]">
          Our Favorite Nail Designs
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {designs.map((design, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="rounded-3xl overflow-hidden shadow-lg mb-4 aspect-square">
                <img 
                  src={design.image} 
                  alt={design.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <p className="text-center text-[#4A3728] font-medium text-lg">
                {design.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}