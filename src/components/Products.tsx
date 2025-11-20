import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import productsHero from "@/assets/products-hero.jpg";

const products = [
  {
    name: "Champú Hidratante Premium",
    description: "Fórmula profesional para cabello seco y dañado. Restaura la hidratación natural.",
    category: "Champú",
  },
  {
    name: "Acondicionador Reparador",
    description: "Tratamiento intensivo que desenreda y repara el cabello desde la raíz.",
    category: "Acondicionador",
  },
  {
    name: "Mascarilla Nutritiva",
    description: "Mascarilla intensiva con aceites naturales para nutrición profunda.",
    category: "Tratamiento",
  },
  {
    name: "Sérum Brillo Diamante",
    description: "Sérum ligero que proporciona brillo excepcional sin dejar residuos.",
    category: "Sérum",
  },
  {
    name: "Aceite de Argán Puro",
    description: "100% natural, ideal para todo tipo de cabello. Nutre y protege.",
    category: "Aceite",
  },
  {
    name: "Protector Térmico",
    description: "Protección profesional contra el calor de planchas y secadores.",
    category: "Protección",
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

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 border-border bg-card"
            >
              <CardHeader>
                <div className="text-sm font-semibold text-primary mb-2">{product.category}</div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{product.description}</CardDescription>
              </CardContent>
            </Card>
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
