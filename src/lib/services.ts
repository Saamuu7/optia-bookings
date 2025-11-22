import { Scissors, Palette, Sparkles, Wind, User, Droplets } from "lucide-react";

export const SERVICES = [
  {
    id: "corte",
    title: "Corte de pelo",
    description: "Cortes modernos y clásicos adaptados a tu estilo personal y tipo de rostro.",
    duration: "45–60 min",
    price: "25€",
    icon: Scissors,
  },
  {
    id: "color",
    title: "Coloración",
    description: "Tintes profesionales, mechas, balayage y técnicas de color innovadoras.",
    duration: "60–150 min",
    price: "40€",
    icon: Palette,
  },
  {
    id: "peinado",
    title: "Peinados y Recogidos",
    description: "Peinados para eventos especiales, bodas y ocasiones importantes.",
    duration: "30–90 min",
    price: "30€",
    icon: Sparkles,
  },
  {
    id: "tratamientos",
    title: "Tratamientos Capilares",
    description: "Tratamientos de hidratación, botox capilar y reparación profunda.",
    duration: "45–120 min",
    price: "35€",
    icon: Wind,
  },
  {
    id: "barba",
    title: "Barba y Afeitado",
    description: "Servicio profesional de barbería, perfilado y afeitado tradicional.",
    duration: "20–40 min",
    price: "15€",
    icon: User,
  },
  {
    id: "alisados",
    title: "Alisados y Permanentes",
    description: "Alisado brasileño, keratina y permanentes para transformar tu look.",
    duration: "90–180 min",
    price: "70€",
    icon: Droplets,
  },
];
