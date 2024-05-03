export const navigationOption:boolean = process.env.NODE_ENV === 'production'
    
export const navigation: { waitUntil: "load" | "domcontentloaded" | "networkidle" | "commit" | undefined} = navigationOption
?{ waitUntil: "load" }
: { waitUntil: "domcontentloaded" };

console.log(process.env.NODE_ENV, 452415);

