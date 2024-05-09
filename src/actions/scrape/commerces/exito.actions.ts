import { DBCoupon, LogType } from "@/interfaces";
import { Browser } from "playwright";
import { logger } from "../helpers";
import { autoScroll } from "@/helpers";

export interface ScrapePageProps {
  browser: Browser;
  url: string;
}

export type CouponScraped = Omit<DBCoupon, "commerce" | "category">;

export const scrapeExito = async ({ browser, url }: ScrapePageProps) => {
  let products: CouponScraped[] = [];
  
  try {

    //* Navega a la página
    const page = await browser.newPage();
    await page.goto(url);

    //* Obtener botón para cargar más productos
    await page.waitForSelector(".Pagination_nextPreviousLink__f7_2J");
    for (let i = 0; i < 4; i++) {
      await autoScroll(page);

      const data = await page.$$eval("article", (articles) =>
        articles.map((article: Element) => {
          const convertToNumber = (item: string | null | undefined) => {
            if (item) {
              const numericValue = item.replace(/[^\d]/g, "");
              return parseInt(numericValue, 10);
            } else {
              return 0;
            }
          };

          const linkElement = article.querySelectorAll(
            ".link_fs-link__6oAwa"
          ) as NodeListOf<HTMLAnchorElement>;
          let linkTitle = "";
          let linkHref = "";
          if (linkElement.length > 0) {
            linkTitle = linkElement[1].title;
            linkHref = linkElement[1].href;
          }

          const img = article.querySelector("img.imagen_plp");

          let imgURL = "";
          if (img) {
            imgURL = img.getAttribute("src") ?? "";
          }

          const priceWithDiscount = article.querySelector(
            ".ProductPrice_container__price__LS1Td"
          );
          const priceWithoutDiscount = article.querySelector(
            ".priceSection_container-promotion_price-dashed__Pzc_z"
          );
          const priceWithCard = article.querySelector(".price_fs-price__7Y_0s");
          const discount = article.querySelector(
            'span[data-percentage="true"]'
          );
          const brandName = article.querySelector(
            ".BrandName_BrandNameTitle__9LquF"
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
          };
          return body;
        })
      );

      products = products.concat(data);

      const nextButton = await page.$(".Pagination_nextPreviousLink__UYeAp");

      if (nextButton) {
        await nextButton.dispatchEvent("click");
      } else {
        break;
      }
    }

    if (!products.length)
      throw new Error("No se encontraron productos en el scrapeo");

  } catch (error: any) {
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
};
