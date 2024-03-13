import { DBCoupon, LogType } from "@/interfaces";
import { CouponScraped, ScrapePageProps } from "./exito.actions";
import { autoScroll } from "@/helpers";
import { logger, saveCoupons } from "../helpers";

export const scrapeMetro = async ({
    browser,
    url,
    categoryId,
    commerceId,
}: ScrapePageProps) => {
    try {
        let products: CouponScraped[] = [];
        
        const page = await browser.newPage();
        await page.goto(url);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Obtén todos los botones
        const buttons = await page.$$(
            ".tiendasjumboqaio-metro-fetch-more-paginator-0-x-buttonPerPage" // Selector que tiene cada botón para cambiar de página
            );

        // Itera sobre cada botón
        for (let i = 1; i < (buttons.length>5?5:buttons.length); i++) {

            await autoScroll(page);
            const newDivs: any = await page.$$eval(
                ".vtex-product-summary-2-x-container", // Selector que tiene cada card de producto
                (divs) =>
                    divs.map((div: Element) => {
                        const stringToNumber = (text: string = "") => {
                            return Number(
                                text.replace(/[^0-9.]/g, "").replaceAll(".", "")
                            );
                        };
                        const image = div.querySelector("img")?.src;
                        const name = div.querySelector("h2 span")?.textContent;
                        const [
                            priceWithDiscount,
                            priceWithoutDiscount,
                            discountWithCard,
                        ] = Array.from(
                            div.querySelectorAll(
                                ".tiendasjumboqaio-metro-minicart-2-x-price"
                            )
                        ).map((priceDiv) =>
                            priceDiv.innerHTML.replace(/[^0-9.]/g, "")
                        );
                        const brandName = div.querySelector(
                            ".vtex-product-summary-2-x-productBrandName"
                        )?.innerHTML;
                        const discount = div.querySelector(
                            ".tiendasjumboqaio-metro-minicart-2-x-containerPercentageFlag"
                        )?.innerHTML;
                        const link = (
                            div.querySelector(
                                "a.vtex-product-summary-2-x-clearLink"
                            ) as HTMLAnchorElement
                        )?.href;

                        return {
                            images: image ? [image] : "",
                            name,
                            lowPrice: stringToNumber(priceWithDiscount),
                            priceWithoutDiscount:
                                stringToNumber(priceWithoutDiscount),
                            discountPercentage: stringToNumber(discount),
                            brandName,
                            discountWithCard: stringToNumber(discountWithCard),
                            url: link,
                            page: "METRO",
                        };
                    })
            );
            products.push(...newDivs);
            // Haz clic en el botón
            await buttons[i].click();
            // Espera un poco para que la página tenga tiempo de reaccionar (ajusta el tiempo según sea necesario)
            
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        
        const parsedProducts: DBCoupon[] = products.map((e) => ({
            ...e,
            commerce: commerceId,
            category: categoryId,
        }));

        const filteredProducts = Array.from(
            new Set(parsedProducts.map((div: DBCoupon) => JSON.stringify(div)))
        )
            .map((div: string) => JSON.parse(div) as DBCoupon)
            .filter(
                ({ priceWithoutDiscount, discountPercentage }) =>
                    priceWithoutDiscount || discountPercentage
            );

        await saveCoupons({
            categoryId,
            commerceId,
            data: filteredProducts,
        });

        await logger(LogType.SUCCESS, "Metro scrapeado correctamente");

        return true;
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
    }
};
