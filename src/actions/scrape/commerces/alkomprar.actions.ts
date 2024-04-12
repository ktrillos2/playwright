import { DBCoupon, LogType } from "@/interfaces";
import { Browser } from "playwright";
import { logger } from "../helpers";
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
    await page.goto(url, { waitUntil: "networkidle" });
        
    //* Obtener botón para cargar más productos
    for (let i = 0; i < 5; i++) {
      const buttonFired = await page.$(".ais-InfiniteHits-loadMore");
    await buttonFired?.click();
    await autoScroll(page); 

   
     const allElement = await page.$$eval(".promotedProduct", (promotedProduct) =>{
          const convertToNumber = (item: string | null | undefined) => {
            if (item) {
              const numericValue = item.replace(/[^\d]/g, "");
              return parseInt(numericValue, 10);
            } else {
              return 0;
            }
          };
         return  promotedProduct.map((product: Element) => {

           const linkElement = product.querySelectorAll(
            ".alk-container-items-category"
          ) as NodeListOf<HTMLAnchorElement>;
          let linkTitle = "";
          let linkHref = "";
          if (linkElement.length > 0) {
            linkTitle = linkElement[1].title;
            linkHref = linkElement[1].href;
          } 
        
               
          const img = product.querySelector(".product__item__information__image");

          let imgURL = "";
          if (img) {
            imgURL = img.getAttribute("src") ?? "";
          }

          const priceWithDiscount = product.querySelector(
            ".product__price--discounts__old"
          );
           const priceWithoutDiscount = product.querySelector(
            ".price"
          );

          const priceWithCard = product.querySelector(".price-contentPlp");
          const discount = product.querySelector(
            'span[.product__item__information__c20m__values]'
          );
          const brandName = product.querySelector(
            ".product__item__information__brand"
          );
        
        
          const body: CouponScraped = {
            name: linkTitle,
            url: linkHref,
            images: imgURL ? [imgURL] : [],
            lowPrice: convertToNumber(priceWithDiscount?.textContent),
            discountWithCard: convertToNumber(priceWithCard?.textContent),
            discountPercentage: convertToNumber(discount?.textContent),
            brandName: brandName?.textContent,
            priceWithoutDiscount: convertToNumber(
              priceWithoutDiscount?.textContent
            ),
          }
          return body;
        })
        
     }); 
        
           products = products.concat(allElement);

      const nextButton = await page.$(".ais-InfiniteHits-loadMore");

      if (nextButton) {
        await nextButton.dispatchEvent("click");
      } else {
        break;
      }
  
    }

    if (!products.length)
      throw new Error("No se encontraron productos en el scrapeo");

  }catch (error: any) {
    await logger(
      LogType.ERROR,
      error?.message ?? "No se pudo scrapear Exito",
      error
    );

    throw new Error(error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
    return products;
  }
}

