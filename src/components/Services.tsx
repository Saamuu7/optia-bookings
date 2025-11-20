import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Palette, Sparkles, Wind, User, Droplets } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Scissors,
    title: "Cortes de Cabello",
    description: "Cortes modernos y clásicos adaptados a tu estilo personal y tipo de rostro.",
  },
  {
    icon: Palette,
    title: "Coloración",
    description: "Tintes profesionales, mechas, balayage y técnicas de color innovadoras.",
  },
  {
    icon: Sparkles,
    title: "Peinados y Recogidos",
    description: "Peinados para eventos especiales, bodas y ocasiones importantes.",
  },
  {
    icon: Wind,
    title: "Tratamientos Capilares",
    description: "Tratamientos de hidratación, botox capilar y reparación profunda.",
  },
  {
    icon: User,
    title: "Barba y Afeitado",
    description: "Servicio profesional de barbería, perfilado y afeitado tradicional.",
  },
  {
    icon: Droplets,
    title: "Alisados y Permanentes",
    description: "Alisado brasileño, keratina y permanentes para transformar tu look.",
  },
];

const Services = () => {
  return (
    <section id="servicios" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-muted-foreground">
            Ofrecemos una amplia gama de servicios profesionales para realzar tu belleza y estilo
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                  <Button
                    asChild
                    variant="link"
                    className="mt-4 text-primary hover:text-primary-hover p-0"
                  >
                    <Link to="/reservar">Reservar ahora →</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
