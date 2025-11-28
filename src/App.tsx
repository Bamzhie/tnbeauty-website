import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NailDesigns from './components/NailDesigns';
import CallToAction from './components/CallToAction';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import BookingPage from './pages/BookingPage';

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <NailDesigns />
        <CallToAction />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<BookingPage />} />
      </Routes>
    </div>
  );
}