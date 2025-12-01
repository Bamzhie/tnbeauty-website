import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import NailDesigns from "./components/NailDesigns";

import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import BookingPage from "./pages/BookingPage";
import ServicesPage from "./pages/ServicesPage";

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <NailDesigns />

        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/book" element={<BookingPage />} />
      </Routes>
    </div>
  );
}
