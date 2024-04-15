import { DBCoupon, LogType } from "@/interfaces";
import { Browser } from "playwright";
import { logger, sleep } from "../helpers";
import { autoScroll } from "@/helpers";

export interface ScrapePageProps {
  browser: Browser;
  url: string;
}

export type CouponScraped = Omit<DBCoupon, "commerce" | "category">;

export const scrapeAlkomprar = async ({ browser, url }: ScrapePageProps) => {
  let products: CouponScraped[] = [];

  try {
    //* Navega a la página
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load" });
    await sleep(1000);
    await autoScroll(page);

    //* Obtener botón para cargar más productos
    for (let i = 0; i < 3; i++) {
      const buttonFired = await page.$(".ais-InfiniteHits-loadMore");
      await buttonFired?.click();
      await autoScroll(page);
    }

    // esperar a que los elementos carguen
    await page.waitForSelector(".promotedProduct");

const section: any;
    const allElement = await page.$$eval(section=> {
      const promotedProduct = document.querySelectorAll('.promotedProduct');

      const convertToNumber = (item: string | null | undefined): number => {
        // logica para convertir de string a numero
        if (item === null || item === undefined) {
            return 0; 
        }
        return parseInt(item); 
    };
    
      promotedProduct.forEach((product: Element) => {
        const nameElement = product.querySelectorAll(
          ".product__item__top__title"
        );

        console.log(nameElement);
        const linkElement = product.querySelectorAll(
          ".alk-grid-items-category"
        ) as NodeListOf<HTMLAnchorElement>;
        if (linkElement.length > 0) {
          console.log(linkElement);
        }


        const img = product.querySelector(".product__item__information__image");
        console.log(img);

        let imgURL = "";
        if (img) {
          imgURL = img.getAttribute("src") ?? "";
        }

        const priceWithDiscount = product.querySelector(
          ".product__price--discounts__old"
        );
        console.log(priceWithDiscount);

        const priceWithoutDiscount = product.querySelector(".price");

        const priceWithCard = product.querySelector(".price-contentPlp");
        const discount = 0;
        const brandName = product.querySelector(
          ".product__item__information__brand"
        );

        const body: CouponScraped = {
          name: convertToNumber(nameElement?.textContext),
          url: "0",
          images: imgURL ? [imgURL] : [],
          lowPrice: convertToNumber(priceWithDiscount?.textContent),
          discountWithCard: convertToNumber(priceWithCard?.textContent),
          discountPercentage: 0,

          brandName: brandName?.textContent,
          priceWithoutDiscount: convertToNumber(
            priceWithoutDiscount?.textContent
          ),p
        };
        return body;
      })
    });

    console.log(allElement);

    if (!allElement.length)
      throw new Error("No se encontraron productos en el scrapeo");
    const promotedProduct = document.querySelectorAll('.promotedProduct');

  } catch (error: any) {
    await logger(
      LogType.ERROR,
      error?.message ?? "No se pudo scrapear Alkomprar",
      error
    );

    throw new Error(error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
    return products;
  }
};
