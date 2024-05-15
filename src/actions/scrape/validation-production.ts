export let navegationOption: "load" | "domcontentloaded" | "networkidle" | "commit";

// Lógica para determinar navegationOption en desarrollo o producción
if (process.env.NODE_ENV === 'production') {
  navegationOption = 'load'; // Opción de navegación en producción
} else {
  navegationOption = 'domcontentloaded'; // Opción de navegación en desarrollo
}

export const navegation: { waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit" } = navegationOption
  ? { waitUntil: "load" }
  : { waitUntil: navegationOption === "domcontentloaded" || navegationOption === "commit" ? navegationOption : "domcontentloaded" };