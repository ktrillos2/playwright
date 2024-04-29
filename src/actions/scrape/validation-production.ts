export const navigationOption = process.env.NODE_ENV === 'production'
    
export const navigation: { waitUntil: "load" | "domcontentloaded"} = navigationOption
?{ waitUntil: "load" }
: { waitUntil: "domcontentloaded" };

console.log(process.env.NODE_ENV);

