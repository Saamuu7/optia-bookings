// Sección de contacto
// - Actualiza la dirección, teléfono y enlaces a redes sociales antes de publicar.
// - El mapa está embebido con Google Maps: reemplaza el `src` por la ubicación real del negocio.
import { MapPin, Clock, Phone, Instagram, Facebook } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contacto</h2>
          <p className="text-lg text-muted-foreground">Estamos aquí para ayudarte — llámanos, escríbenos por WhatsApp o visítanos.</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Map on top */}
          <div className="rounded-2xl overflow-hidden shadow-xl h-[360px] md:h-[480px] mb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.1982978926665!2d-3.7037901999999997!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc436dec1618c2269!2sPuerta%20del%20Sol!5e0!3m2!1sen!2ses!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de ERYCK_STYLE"
            />
          </div>

          {/* Info cards in a row below the map - force equal size */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            <Card className="border-border h-full">
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Ubicación</h3>
                    <p className="text-muted-foreground">Calle Principal 123 · Madrid, España 28001</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border h-full">
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Horarios</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Lunes a viernes: 10:00 – 14:00 y 16:00 – 20:00</p>
                      <p>Sábados: 10:00 – 14:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border h-full">
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Teléfono</h3>
                      <a href="tel:+34912345678" className="text-primary hover:text-primary-hover text-lg font-medium">+34 912 345 678</a>
                    </div>
                    <div className="mt-auto">
                      <Button asChild size="sm" className="bg-[#25D366] hover:bg-[#20BA5A]">
                        <a href="https://wa.me/34912345678" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social icons centered */}
          <div className="flex justify-center mt-8 gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform" aria-label="Instagram">
              <Instagram className="w-6 h-6 text-white" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform" aria-label="Facebook">
              <Facebook className="w-6 h-6 text-white" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform" aria-label="TikTok">
              <FaTiktok className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
