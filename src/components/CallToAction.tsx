// src/components/CallToAction.tsx
import BookNowButton from './BookNowBtn';

export default function CallToAction() {
  return (
    <section className="py-16 bg-[#FAF3EA]">
      <div className="container mx-auto px-6">
        <div className="grid md:flex md:items-center md:justify-center md:gap-12 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A3728] mb-6 md:mb-0">
            Ready for your next<br />manicure?
          </h2>

          {/* Reusable Button */}
          <BookNowButton className="w-full md:w-auto justify-center md:justify-start" />
        </div>
      </div>
    </section>
  );
}