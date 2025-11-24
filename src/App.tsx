import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NailDesigns from './components/NailDesigns';
import CallToAction from './components/CallToAction';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <Navbar />
      <main>
        <Hero />
        <NailDesigns />
        <CallToAction />
        <Testimonials />
      </main>
      <Footer />
   
    </div>
  );
}