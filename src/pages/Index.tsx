// Página principal que compone las secciones del sitio.
// NOTA: `Header` y `Footer` no se traducen según la petición del cliente.
// Esta página únicamente importa y ordena las secciones.
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Products from "@/components/Products";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Delay to ensure DOM mounted
      requestAnimationFrame(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    }
    // Apply full-page gradient only on home route
    document.body.classList.add('home-gradient');
    return () => {
      document.body.classList.remove('home-gradient');
    };
  }, [location]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Services />
      <Products />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
