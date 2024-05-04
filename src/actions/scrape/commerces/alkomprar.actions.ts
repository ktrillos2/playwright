import { DBCoupon, LogType } from "@/interfaces";
import { Browser } from "playwright";
import { logger, sleep, } from "../helpers";
import { autoScroll } from "@/helpers";

export interface ScrapePageProps {
  browser: Browser;
  url: string;
}

export type CouponScraped = Omit<DBCoupon, "commerce" | "category"> & { images?: string[] };

export const scrapeAlkomprar = async ({ browser, url }: ScrapePageProps): Promise<CouponScraped[]> => {
  let products: CouponScraped[] = [];


  try {
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "load"});
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
        const nameElement: any = product.querySelector(".product__item__top__title");
        const image = product.querySelector<HTMLImageElement>("img");
        const priceWithoutDiscountElement = product.querySelector(".product__price--discounts__old");
        const priceWithDiscount = product.querySelector(".price");
        const priceWithCard = product.querySelector(".price-contentPlp span");
        const brandName = product.querySelector(".product__item__information__brand");

      

        //convertir los datos de string o null a numero
        const convertToNumber = (item: string | null) => {
          if (item) {
            const numericValue = item.replace(/[^\d]/g, "");
            return parseInt(numericValue, 10);
          } else {
            return 0;
          }
        };
          // calcular el porcentaje de cada producto
        const discountPercentage = (priceWithoutDiscount: number | null | undefined, priceWithDiscount: number): number => {
          if (priceWithoutDiscount && priceWithDiscount) {
            const discountAmount = priceWithoutDiscount - priceWithDiscount; // calcular la cantidad de descuento
            const totalPercentage = (discountAmount / priceWithoutDiscount) * 100; // calcular el porcentaje
            return Math.round(totalPercentage);
          } else {
            return 0;
          }
        };

        const lowPrice = convertToNumber(priceWithDiscount ? priceWithDiscount.textContent : "");
        const priceWithoutDiscount = convertToNumber(priceWithoutDiscountElement ? priceWithoutDiscountElement.textContent : "");

        return {
          name: nameElement ? nameElement.textContent!.trim() : "",
          url: nameElement ? "https://www.alkomprar.com" +  nameElement.getAttribute("data-url") : "",
          lowPrice,
          discountWithCard: convertToNumber(priceWithCard ? priceWithCard.textContent : ""),
          brandName: brandName ? brandName.textContent!.trim() : "",
          priceWithoutDiscount,
          discountPercentage: discountPercentage(
            priceWithoutDiscount,
            lowPrice),
          images: image ? [image.src] : [],
        };
      });
    });
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