// src/App.tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FloatingCard from './components/FloatingCard';
import FeatureBox from './components/FeatureBox';
import Stats from './components/Stats';
import Services from './components/Services';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Navbar />
      <main className="relative">
        <Hero />
        {/* Floating Card: Hidden on mobile */}
        <div className="hidden lg:block">
          <FloatingCard />
        </div>

        {/* Features Grid: 1-col → 3-col */}
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureBox
            title="We use best products!"
            subtitle="Working with premium brands."
            icon="Sparkles"
          />
          <Stats />
          <FeatureBox
            title="We blend natural ingredients & luxury care"
            cta="LEARN MORE"
            icon="Flower"
          />
        </div>

        <Services />
      </main>
    </div>
  );
}