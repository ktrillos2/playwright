import { DBCoupon, LogType } from "@/interfaces";
import { Browser } from "playwright";
import { logger, sleep,  } from "../helpers";
import { autoScroll } from "@/helpers";

export interface ScrapePageProps {
  browser: Browser;
  url: string;
}

export type CouponScraped = Omit<DBCoupon, "commerce" | "category">& { images?: string[] };

export const scrapeAlkomprar = async ({ browser, url }: ScrapePageProps): Promise<CouponScraped[]> => {
  let products: CouponScraped[] = [];


  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load" });
    await sleep(1000);
    await autoScroll(page);

    //iterar el boton de cargar mas productos
    for (let i = 0; i < 5; i++) {
      const buttonFired = await page.$(".ais-InfiniteHits-loadMore");
      await buttonFired?.click();
      await autoScroll(page);
    }
    //esperar a que carguen los elementos 
    await page.waitForSelector(".ais-InfiniteHits-item");

    // evaluar agregar los datos a CouponScraped[]
    products = await page.$$eval(".ais-InfiniteHits-item", (elements) => {
      return elements.map(product => {

        //obtener los datos 
        const nameElement = product.querySelector(".product__item__top__title");
        const linkElement = product.querySelector<HTMLAnchorElement>('.product__item__top__title a');         // HTMLAnchorElement= obtener dentro de cada elemento de producto un enlace `<a>
        const image = product.querySelector(".product__item__information__image");
        const priceWithDiscount = product.querySelector(".product__price--discounts__old");
        const priceWithoutDiscount = product.querySelector(".price");
        const priceWithCard = product.querySelector(".price-contentPlp");
        const brandName = product.querySelector(".product__item__information__brand");

// calcilar el porcentaje de cada producto

//convertir los datos de string o null a numero
        const convertToNumber = (item: string | null) => {
          if (item) {
            const numericValue = item.replace(/[^\d]/g, "");
            return parseInt(numericValue, 10);
          } else {
            return 0;
          }
        };

        return {
          name: nameElement ? nameElement.textContent!.trim() : "", 
          url: linkElement ? linkElement.href : "",
          image: image ? image.getAttribute("src")! : "",
          lowPrice: convertToNumber(priceWithDiscount ? priceWithDiscount.textContent : ""),
          discountWithCard: convertToNumber(priceWithCard ? priceWithCard.textContent : ""),
          brandName: brandName ? brandName.textContent!.trim() : "",
          priceWithoutDiscount: convertToNumber(priceWithoutDiscount ? priceWithoutDiscount.textContent : ""),
          discountPercentage: 0,
          images: [],
        };
      });
    });
    console.log(products);
  } catch (error: any) {
    await logger(LogType.ERROR, error?.message ?? "No se pudo scrapear Alkomprar", error);
    throw new Error(error?.message ?? "No se pudo scrapear Alkomprar");
  } finally {
    if (browser) {
      await browser.close();
    }
    return products;
  }
};
