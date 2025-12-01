import { useNavigate } from "react-router-dom";
import { ShoppingCart, Calendar, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { coreServices, nailArtLevels } from "../data/services";
import Footer from "../components/Footer";

// Service descriptions and images
const serviceDetails = {
  "gel-x": {
    description:
      "Gel-X extensions are a revolutionary nail enhancement system that uses soft gel tips for a lightweight, natural feel. Perfect for those who want length and durability without the heaviness of traditional acrylics.",
    image: "/level2/img1.webp",
  },
  acrylic: {
    description:
      "Classic acrylic nails offer strength and versatility. Ideal for those who want durable, long-lasting nails that can be shaped and styled to perfection. Great for nail biters and those wanting extra length.",
    image: "/level3/img1.webp",
  },
  biab: {
    description:
      "Builder in a Bottle (BIAB) is a strengthening gel system that builds and protects your natural nails. Perfect for growing out damaged nails or adding subtle length while maintaining a natural look.",
    image: "/level1/img1.webp",
  },
  "gel-manicure": {
    description:
      "A gel manicure provides a glossy, chip-resistant finish that lasts up to 2-3 weeks. Your natural nails are shaped, buffed, and coated with gel polish that cures under UV light for instant drying.",
    image: "/level2/img2.webp",
  },
  "gel-toes": {
    description:
      "Gel pedicure for beautiful, long-lasting toes. Enjoy chip-free color that stays vibrant for weeks. Includes nail shaping, cuticle care, and gel polish application.",
    image: "/level1/img2.webp",
  },
};

export default function ServicesPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<string[]>([]);

  const addToCart = (serviceId: string) => {
    if (!cart.includes(serviceId)) {
      setCart([...cart, serviceId]);
    }
  };

  const removeFromCart = (serviceId: string) => {
    setCart(cart.filter((id) => id !== serviceId));
  };

  const bookNow = (serviceId: string) => {
    // Combine cart items with the clicked service (avoiding duplicates)
    const servicesToBook = [...new Set([...cart, serviceId])];

    // Navigate to booking page with all selected services
    navigate("/book", { state: { preSelectedServices: servicesToBook } });
  };

  const bookCart = () => {
    // Navigate to booking page with all cart items
    navigate("/book", { state: { preSelectedServices: cart } });
  };

  return (
    <div className="min-h-screen">
      <main className="pt-8 pb-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[#4A3728] hover:text-[#8B6F5C] transition font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Home
            </button>

            {cart.length > 0 && (
              <button
                onClick={bookCart}
                className="flex items-center gap-2 bg-[#E8B4A8] text-white px-6 py-2 rounded-full hover:bg-[#D9A498] transition shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                Book Cart ({cart.length})
              </button>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#4A3728] mb-4">
            Our Services
          </h1>
          <p className="text-[#6B5344] mb-12 max-w-3xl">
            Discover our range of professional nail services. Each treatment is
            performed with precision and care.
          </p>

          {/* Core Services */}
          <section className="mb-16">
            <div className="space-y-8">
              {coreServices.map((service) => {
                const details =
                  serviceDetails[service.id as keyof typeof serviceDetails];
                const inCart = cart.includes(service.id);

                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
                  >
                    {/* Title */}
                    <div className="p-6 pb-2">
                      <h3 className="text-2xl font-bold text-[#4A3728] text-center">
                        {service.name}
                      </h3>
                    </div>

                    {/* Image */}
                    <div className="w-full aspect-video sm:aspect-[2/1] overflow-hidden">
                      <img
                        src={details.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-4 flex flex-col items-center text-center">
                      <p className="text-[#6B5344] mb-4 leading-relaxed max-w-2xl">
                        {details.description}
                      </p>
                      <p className="text-3xl font-bold text-[#E8B4A8] mb-6">
                        £{service.price}
                      </p>

                      {/* Buttons */}
                      <div className="flex gap-3 w-full max-w-md">
                        <button
                          onClick={() =>
                            inCart
                              ? removeFromCart(service.id)
                              : addToCart(service.id)
                          }
                          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
                            inCart
                              ? "bg-[#4A3728] text-white hover:bg-[#3A2B20]"
                              : "border-2 border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728] hover:text-white"
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {inCart ? "In Cart" : "Add to Cart"}
                        </button>
                        <button
                          onClick={() => bookNow(service.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#E8B4A8] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#D9A498] transition"
                        >
                          <Calendar className="w-4 h-4" />
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Nail Art Levels */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A3728] mb-4">
              Nail Art
            </h2>
            <p className="text-[#6B5344] mb-8">
              Elevate your nails with our artistic designs. Choose from four
              levels of complexity to match your style.
            </p>
            <div className="space-y-8">
              {nailArtLevels.map((level) => {
                const inCart = cart.includes(level.id);

                return (
                  <div
                    key={level.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
                  >
                    {/* Title */}
                    <div className="p-6 pb-2">
                      <h3 className="text-2xl font-bold text-[#4A3728] text-center">
                        {level.name}
                      </h3>
                    </div>

                    {/* Image */}
                    <div className="w-full aspect-video sm:aspect-[2/1] overflow-hidden">
                      <img
                        src={level.image}
                        alt={level.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-4 flex flex-col items-center text-center">
                      <p className="text-[#6B5344] mb-4 leading-relaxed max-w-2xl">
                        {level.description}
                      </p>
                      <p className="text-3xl font-bold text-[#E8B4A8] mb-6">
                        £{level.price}
                      </p>

                      {/* Buttons */}
                      <div className="flex gap-3 w-full max-w-md">
                        <button
                          onClick={() =>
                            inCart
                              ? removeFromCart(level.id)
                              : addToCart(level.id)
                          }
                          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
                            inCart
                              ? "bg-[#4A3728] text-white hover:bg-[#3A2B20]"
                              : "border-2 border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728] hover:text-white"
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {inCart ? "In Cart" : "Add to Cart"}
                        </button>
                        <button
                          onClick={() => bookNow(level.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#E8B4A8] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#D9A498] transition"
                        >
                          <Calendar className="w-4 h-4" />
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
