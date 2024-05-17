export const navegation: { [key: string]: string }  = {
  METRO: process.env.NODE_ENV === "production" ? "load" : "domcontentloaded",
  EXITO: process.env.NODE_ENV === "production" ? "load" : "networkidle",
  KOAJ: process.env.NODE_ENV === "production" ? "load" : "networkidle",
  ALKOMPAR: process.env.NODE_ENV === "production" ? "load" : "networkidle",
  HYM: process.env.NODE_ENV === "production" ? "load" : "domcontentloaded",
}
