import { DBCoupon, LogType } from "@/interfaces";
import { Browser } from "playwright";
import { logger, sleep } from "../helpers";
import { autoScroll } from "@/helpers";

export interface ScrapePageProps {
	browser: Browser;
	url: string;
}

export type CouponScraped = Omit<DBCoupon, "commerce" | "category"> & {
	images?: string[];
};

export const scrapeTelegram = async ({
	browser,
	url,
}: ScrapePageProps): Promise<CouponScraped[]> => {
	let products: CouponScraped[] = [];

	try {
		const page = await browser.newPage();
		await page.goto("https://t.me/s/DescuentosTech", { waitUntil: "load" });
    await sleep(1000);
    
    const startTime = Date.now();
    while (Date.now() - startTime < 5000) {
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await sleep(100);
    }

    const data = await page.$$eval(
      "div.tgme_widget_message_bubble",
      (elements) => {
        return elements.map((element) => {
          const text = element.textContent || "";
          const links = Array.from(element.querySelectorAll("a"))
            .map((a) => a.href)
            .filter((link) => !link.startsWith("https://t.me"));
          const imageElement = element.querySelector('a.tgme_widget_message_photo_wrap') as HTMLElement;
          let imageUrl = '';
          if (imageElement && imageElement.style.backgroundImage) {
            const match = imageElement.style.backgroundImage.match(/url\("([^"]*)"\)/);
            imageUrl = match ? match[1] : '';
          }

          return { text, links, imageUrl };
        });
      }
    );

    for (const item of data) {
      if (item.links[0]) { // Solo crea el producto si tiene URL
        const product: DBCoupon = {
          name: item.text,
          brandName: "Amazon", // Rellena con el valor adecuado
          images: [item.imageUrl],
          lowPrice: 0,
          priceWithoutDiscount: 0, // Rellena con el valor adecuado
          discountWithCard: 0, // Rellena con el valor adecuado
          discountPercentage: 90,
          url: item.links[0],
          commerce: '', // Rellena con el valor adecuado
          category: '', // Rellena con el valor adecuado
        };
    
        products.push(product);
      }
    }
		return products;
	} catch (error: any) {
		await logger(
			LogType.ERROR,
			error?.message ?? "No se pudo scrapear Alkomprar",
			error
		);
		throw new Error(error?.message ?? "No se pudo scrapear Alkomprar");
	} finally {
		if (browser) {
			// await browser.close();
		}
		return products;
	}
};
