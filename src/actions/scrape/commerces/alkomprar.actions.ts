import { DBCoupon, LogType } from "@/interfaces";
import { Browser } from "playwright";
import { logger, sleep } from "../helpers";
import { autoScroll } from "@/helpers";
import { IoBody } from "react-icons/io5";
import { all } from "axios";

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
    for (let i = 0; i < 5; i++) {
      const buttonFired = await page.$(".ais-InfiniteHits-loadMore");
      await buttonFired?.click();
      await autoScroll(page);
    }

    const allElement = await page.$$eval("section", (promotedProduct) =>
      promotedProduct.map((product) => {
        const convertToNumber = (item: string | null) => {
          if (item) {
            const numericValue = item.replace(/[^\d]/g, "");
            return parseInt(numericValue, 10);
          } else {
            return 0;
          }
        };


        const nameElement = product.querySelector(
          ".product__item__top__title"
        );

        const linkElement: NodeListOf<Element> = product.querySelectorAll("a.skiptocontent");

        let link: string | null = null;

        if (linkElement.length > 0) {
          const firstElement = linkElement[0];
          // Accedemos al atributo href del elemento
          link = firstElement.getAttribute("href");
        }


        console.log(link);

        // verificar que no sea undefine o null y crear la lista de elementos encontrados
        const image: Element | null = product.querySelector(".product__item__information__image");

        let imagesElements: NodeListOf<Element>;

        if (image) {
          imagesElements = document.querySelectorAll(".product__item__information__image");
        } else {
          imagesElements = document.querySelectorAll(""); // Esto devolverá una NodeList vacía
        }


        const images: string[] = [];

        imagesElements.forEach((img) => {
          if (img) {
            images.push(img.getAttribute("src")!);
          }
        });
        console.log(images)

        const priceWithDiscount = product.querySelector(
          ".product__price--discounts__old"
        );
        console.log(priceWithDiscount)
        const priceWithoutDiscount = product.querySelector(
          ".price"
        );
        console.log(priceWithoutDiscount)

        const priceWithCard = product.querySelector(".price-contentPlp"

        );
        console.log(priceWithCard)

        const discount = 0;
        console.log(discount);

        const brandName = product.querySelector(
          ".product__item__information__brand"
        ); 'NodeListOf<Element>'


        console.log(brandName)
        return {
          name: nameElement ? nameElement.textContent! : "",
          url: linkElement ? "https://www.alkomprar.com/celulares" +
            linkElement
            : "",
          images,
          lowPrice: convertToNumber(priceWithDiscount ? priceWithDiscount.textContent! : ""),
          discountWithCard: convertToNumber(priceWithCard ? priceWithCard.textContent! : ""
          ),
          brandName: "",
          priceWithoutDiscount: convertToNumber(priceWithoutDiscount ? priceWithoutDiscount.textContent! : ""
          ),
          discountPercentage: 0,

        };
      })
    );


    products = allElement;

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
}
