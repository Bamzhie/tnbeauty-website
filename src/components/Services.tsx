export default function Services() {
  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-[var(--color-primary)]">Our Services</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
  {['Gel-x', 'Acrylic', 'Biab', 'Pedicure', 'Gel Manicure'].map(service => (
    <div key={service} className="bg-white/80 backdrop-blur rounded-2xl p-3 sm:p-4 text-center shadow-md">
      <p className="font-semibold text-[var(--color-primary)] text-sm sm:text-base">{service}</p>
    </div>
  ))}
</div>
    </section>
  );
}