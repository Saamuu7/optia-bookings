// Galería de trabajos (carrusel)
// - Reemplaza `assets/` con las imágenes reales del cliente.
// - Carousel automático y navegación manual.
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import galleryImage from "@/assets/gallery-1.jpg";
import aboutImage from "@/assets/about-salon.jpg";
import heroImage from "@/assets/hero-salon.jpg";

const IMAGES = [galleryImage, aboutImage, heroImage];

const Gallery = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setOpenIndex(index);
  const closeLightbox = () => setOpenIndex(null);

  const showPrev = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((openIndex - 1 + IMAGES.length) % IMAGES.length);
  }, [openIndex]);

  const showNext = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((openIndex + 1) % IMAGES.length);
  }, [openIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, showPrev, showNext]);

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Galería de Trabajos</h2>
          <p className="text-lg text-muted-foreground">Algunas de nuestras transformaciones y el ambiente del salón.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {IMAGES.map((src, i) => (
            <figure key={i} className="relative rounded-xl overflow-hidden group">
              <button
                onClick={() => openLightbox(i)}
                className="w-full h-56 sm:h-48 md:h-56 block focus:outline-none"
                aria-label={`Abrir imagen ${i + 1}`}
              >
                <img src={src} alt={`Trabajo ${i + 1}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
              </button>
              <figcaption className="sr-only">Trabajo {i + 1}</figcaption>
            </figure>
          ))}
        </div>

        {/* Lightbox modal */}
        {openIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative max-w-4xl w-full mx-4">
              <button
                onClick={closeLightbox}
                className="absolute right-3 top-3 z-20 bg-white/90 text-foreground rounded-full p-2 hover:opacity-95"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative bg-black rounded-lg overflow-hidden">
                <img src={IMAGES[openIndex]} alt={`Trabajo ${openIndex + 1}`} className="w-full h-[70vh] object-contain max-h-[80vh] bg-black" />

                <button
                  onClick={showPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={showNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
