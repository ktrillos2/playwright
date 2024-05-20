import { LogType } from "@/interfaces";
import { CouponScraped, ScrapePageProps } from "./exito.actions";
import { logger } from "../helpers";
import { navegation } from "../validation-production";

export const scrapeKoaj = async ({ browser, url }: ScrapePageProps) => {
  let products: CouponScraped[] = [];
  try {
    let linksToNavigate: string[] = [];

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    const buttonFired = await page.$(".wpn-mv-bubble");
    buttonFired?.click();

    //* Buscar todos los divs padres con clase 'wpn-mv-single-product'
    const parentElements = await page.$$(".wpn-mv-single-product");
    if (!parentElements) throw new Error("Hubo un error, vuelve a scrapear");
    for (const parentElement of parentElements) {
      // Buscar el enlace dentro del div padre y obtener su atributo 'href'
      const linkElement = await parentElement.$("a");
      if (linkElement) {
        const linkHref = await parentElement.$eval(
          "a",
          (a) => (a as HTMLAnchorElement).href
        );
        linksToNavigate.push(linkHref);
      }
    }

    for (const link of linksToNavigate) {
      // Navegar a la URL del enlace
      await page.goto(link, navegation);

      // Buscar el span con id 'our_price_display' y obtener su valor
      const discountElement = await page.$("#our_price_display");
      let discount = "";
      if (discountElement) {
        discount = await page.$eval(
          "#our_price_display",
          (el) => el.textContent || ""
        );
        discount = discount.replace(/\$|,/g, ""); // Eliminar el signo del dólar y la coma
      }

      // Buscar el span con id 'old_price_display' y obtener su valor
      const priceElement = await page.$("#old_price_display");
      let priceWithoutDiscount = "";
      if (priceElement) {
        priceWithoutDiscount = await page.$eval(
          "#old_price_display",
          (el) => el.textContent || ""
        );
        priceWithoutDiscount = priceWithoutDiscount.replace(/\$|,/g, ""); // Eliminar el signo del dólar y la coma
      }

      // Buscar el h1 con clase 'product_name' y obtener su valor
      const titleElement = await page.$(".product_name");
      let productTitle = "";
      if (titleElement) {
        productTitle = (
          await page.$eval(".product_name", (el) => el.textContent || "")
        ).trim();
      }

      // Calcular el porcentaje de descuento
      const discountPercentage = Math.round(
        ((parseFloat(priceWithoutDiscount) - parseFloat(discount)) /
          parseFloat(priceWithoutDiscount)) *
          100
      );

      // Buscar el div con clase 'thumbs-wrapper swiper-wrapper'
      const imgWrapperElement = await page.$(".thumbs-wrapper.swiper-wrapper");
      let imgSrc = "";
      if (imgWrapperElement) {
        // Buscar la primera imagen dentro del div y obtener su atributo 'src'
        const imgElement = await imgWrapperElement.$("img[itemprop='imaxsge']");
        if (imgElement) {
          imgSrc = await page.$eval(
            'img[itemprop="image"]',
            (img) => (img as HTMLImageElement).src
          );
        }
      }

      // Agregar los valores obtenidos al array 'productsScrapped'
      products.push({
        url: link,
        name: productTitle,
        brandName: "koaj",
        images: [imgSrc],
        lowPrice: parseFloat(discount),
        priceWithoutDiscount: parseFloat(priceWithoutDiscount),
        discountWithCard: 0,
        discountPercentage: discountPercentage,
      });
    }

    if (!products.length)
      throw new Error("No se encontraron productos en el scrapeo");

  } catch (error: any) {
    await logger(
      LogType.ERROR,
      error?.message ?? "No se pudo scrapear Metro",
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
