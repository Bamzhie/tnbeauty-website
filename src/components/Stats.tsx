export default function Stats() {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
      <div className="flex -space-x-2 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white" />
        <div className="w-12 h-12 rounded-full bg-gray-400 border-2 border-white" />
      </div>
      <p className="text-4xl font-black text-[var(--color-primary)]">1000+</p>
      <p className="text-sm text-[var(--color-muted)]">Happy Customers</p>
    </div>
  );
}