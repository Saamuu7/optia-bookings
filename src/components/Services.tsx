import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICES } from "@/lib/services";

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
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border bg-card rounded-xl overflow-hidden"
              >
                <CardContent>
                  <div className="flex items-start gap-4 p-5">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white ring-1 ring-border">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-foreground truncate">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{service.description}</p>

                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Duración: <strong className="text-foreground">{service.duration || '—'}</strong></span>
                        <span>Precio: <strong className="text-foreground">{service.price || '—'}</strong></span>
                      </div>
                    </div>
                  </div>
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
