import { Link } from "react-router-dom";
import { Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import logo from "@/assets/logo-optia.png";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <img src={logo} alt="ERYCK_STYLE" className="h-14 mb-4 brightness-0 invert" />
            <p className="text-sm text-background/80 max-w-xs">
              ERYCK_STYLE — Salón profesional especializado en cortes, color y cuidados
              masculinos. Calidad y atención personalizada en cada visita.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a href="/reservar" className="inline-block">
                <Button asChild size="sm" variant="premium">
                  <Link to="/reservar">Reservar ahora</Link>
                </Button>
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-3 text-sm text-background/80">
              <li>
                <Link to="/" className="hover:text-background transition-colors">Inicio</Link>
              </li>
              <li>
                <a href="#servicios" className="hover:text-background transition-colors">Servicios</a>
              </li>
              <li>
                <a href="#productos" className="hover:text-background transition-colors">Productos</a>
              </li>
              <li>
                <Link to="/reservar" className="hover:text-background transition-colors">Reservar</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold mb-4">Horario & Contacto</h4>
            <div className="text-sm text-background/80 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <div className="font-medium text-background">Calle Principal 123</div>
                  <div className="text-xs">Madrid, 28001</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+34912345678" className="hover:text-background transition-colors">+34 912 345 678</a>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div className="text-sm text-background/80">Lun-Vie: 10:00–20:00 · Sáb: 10:00–15:00</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold mb-4">Síguenos</h4>
            <p className="text-sm text-background/80 mb-4">Conéctate con nosotros para ver trabajos recientes y promociones.</p>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors" aria-label="TikTok">
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">© {currentYear} ERYCK_STYLE. Todos los derechos reservados.</p>
          <p className="text-sm text-background/60 mt-4 md:mt-0">
            Diseñado por{' '}
            <a
              href="https://optia.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-background transition-colors font-medium"
            >
              OPTIAAgency
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
