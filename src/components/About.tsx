import aboutImage from "@/assets/about-salon.jpg";

const About = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img
                src={aboutImage}
                alt="Nuestro salón"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Quiénes Somos
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                En <span className="text-primary font-semibold">Optia Peluquería</span>, somos más
                que un salón de belleza. Somos un equipo apasionado de profesionales dedicados a
                realzar tu estilo único y personalidad.
              </p>
              <p>
                Con años de experiencia en el sector, combinamos técnicas innovadoras con atención
                personalizada para ofrecerte resultados excepcionales en cada visita.
              </p>
              <p>
                Nuestra filosofía se basa en escuchar tus necesidades, asesorarte profesionalmente
                y crear looks que no solo te hagan ver bien, sino también sentirte increíble.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">10+</div>
                <div className="text-sm text-muted-foreground">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">5K+</div>
                <div className="text-sm text-muted-foreground">Clientes felices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
