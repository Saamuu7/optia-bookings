import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import productsHero from "@/assets/products-hero.jpg";

// Lista de productos de ejemplo. Actualiza según inventario real.
const products = [
  {
    id: "champu-hidratante",
    name: "Champú Hidratante Premium",
    description: "Fórmula profesional para cabello seco y dañado. Restaura la hidratación natural.",
    size: "250 ml",
    price: "18€",
  },
  {
    id: "acondicionador-reparador",
    name: "Acondicionador Reparador",
    description: "Tratamiento intensivo que desenreda y repara el cabello desde la raíz.",
    size: "200 ml",
    price: "20€",
  },
  {
    id: "mascarilla-nutritiva",
    name: "Mascarilla Nutritiva",
    description: "Mascarilla intensiva con aceites naturales para nutrición profunda.",
    size: "250 ml",
    price: "28€",
  },
  {
    id: "serum-brillo",
    name: "Sérum Brillo Diamante",
    description: "Sérum ligero que proporciona brillo excepcional sin dejar residuos.",
    size: "50 ml",
    price: "22€",
  },
  {
    id: "aceite-argan",
    name: "Aceite de Argán Puro",
    description: "100% natural, ideal para todo tipo de cabello. Nutre y protege.",
    size: "100 ml",
    price: "24€",
  },
  {
    id: "protector-termico",
    name: "Protector Térmico",
    description: "Protección profesional contra el calor de planchas y secadores.",
    size: "150 ml",
    price: "16€",
  },
];

const Products = () => {
  return (
    <section id="productos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Productos Profesionales
          </h2>
          <p className="text-lg text-muted-foreground">
            Productos de alta calidad disponibles en nuestro salón para el cuidado de tu cabello
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl max-w-4xl mx-auto">
          <img
            src={productsHero}
            alt="Productos capilares"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Products Grid: image on top, content below */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-44 bg-gray-100">
                <img src={productsHero} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                  </div>

                  <div className="flex-shrink-0 text-right ml-4">
                    <div className="text-sm text-muted-foreground">&nbsp;</div>
                    <div className="mt-2 text-lg font-semibold text-primary">{p.price}</div>
                    {/* Size moved below price as a small muted label */}
                    {p.size && <div className="text-xs text-muted-foreground mt-1">{p.size}</div>}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-12 text-center p-6 bg-muted rounded-xl">
          <p className="text-muted-foreground">
            💡 <span className="font-semibold">Nota:</span> Los productos están disponibles para
            consulta y compra en nuestro salón. Nuestro equipo te asesorará sobre los mejores
            productos para tu tipo de cabello.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Products;
