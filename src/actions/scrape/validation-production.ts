
 import * as dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

// Ahora puedes acceder a process.env.NODE_ENV
export const navegationOption:boolean = process.env.NODE_ENV === 'production'
    
export const navegation: { waitUntil: "load" | "domcontentloaded" | "networkidle" | "commit" } = navegationOption
?{ waitUntil: "load" }
: { waitUntil: "networkidle" };


console.log(process.env.NODE_ENV);


 