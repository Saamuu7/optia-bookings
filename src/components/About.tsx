// Sección "Quiénes Somos" (About)
// Contiene información descriptiva del salón y estadísticas.
// Cambia los textos y la imagen en `assets/` según sea necesario para tu cliente.
import aboutImage from "@/assets/about-salon.jpg";

const About = () => {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <header className="max-w-3xl mx-auto text-center mb-10">
          <h2 id="about-heading" className="text-4xl md:text-5xl font-bold text-foreground">Quiénes somos</h2>
          <p className="mt-3 text-muted-foreground">
            ERYCK STYLE es un salón profesional especializado en ofrecer experiencias de belleza
            integrales. Nuestro equipo une técnica, creatividad y compromiso para ofrecer resultados
            que respetan la salud del cabello y reflejan la personalidad de cada cliente.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-6">
            <article className="prose prose-invert max-w-none text-muted-foreground">
              <h3 className="text-2xl text-foreground font-semibold">Nuestro enfoque</h3>
              <p>
                Trabajamos con materiales y productos de primera calidad, aplicando técnicas
                modernas y sostenibles. Cada servicio comienza con una valoración personalizada
                para asegurar que el tratamiento sea el más adecuado según tipo de cabello,
                estilo de vida y objetivos estéticos.
              </p>

              <h4 className="text-lg text-foreground font-medium">Valores</h4>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Profesionalidad y formación continua</li>
                <li>Respeto por la salud capilar</li>
                <li>Atención personalizada y honesta</li>
                <li>Sostenibilidad en productos y procesos</li>
              </ul>

              <h4 className="text-lg text-foreground font-medium">Qué ofrecemos</h4>
              <p className="text-sm text-muted-foreground">
                Servicios de corte, coloración, peinados de ocasión, tratamientos reparadores y
                asesoría de imagen. Nuestra oferta se adapta tanto a clientes que buscan un cambio
                radical como a quienes prefieren un mantenimiento estético de calidad.
              </p>
            </article>

            <section className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">12+</div>
                <div className="text-sm text-muted-foreground">Años en el sector</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">6k+</div>
                <div className="text-sm text-muted-foreground">Clientes atendidos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Tasa de satisfacción</div>
              </div>
            </section>
          </div>

          <aside className="hidden md:block">
            <div className="rounded-2xl overflow-hidden shadow-card">
              <img src={aboutImage} alt="Equipo y salón" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Equipo:</strong> estilistas certificados, coloristas
              especializados y tecnicos en tratamientos capilares.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default About;
