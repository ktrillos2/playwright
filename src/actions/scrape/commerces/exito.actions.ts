import { DBCoupon, LogType } from "@/interfaces";
import { Browser } from "playwright";
import { logger, saveCoupons } from "../helpers";
import { autoScroll } from "@/helpers";

export interface ScrapePageProps {
	browser: Browser;
	url: string;
	commerceId: string;
	categoryId: string;
}

export type CouponScraped = Omit<DBCoupon, "commerce" | "category">;

export const scrapeExito = async ({
	browser,
	url,
	categoryId,
	commerceId,
}: ScrapePageProps) => {
	try {
		let products: CouponScraped[] = [];
		console.log("1");
		const page = await browser.newPage();
		console.log("2");
		await page.goto(url);

		console.log("3");

		await page.waitForSelector(".Pagination_nextPreviousLink__UYeAp");
		console.log("ENTROOO")
		for (let i = 0; i < 2; i++) {
			console.log("4");

			await autoScroll(page);
			console.log("4 scroll");
			const data = await page.$$eval("article", (articles) =>
				articles.map((article: Element) => {
					const convertToNumber = (
						item: string | null | undefined
					) => {
						if (item) {
							const numericValue = item.replace(/[^\d]/g, "");
							return parseInt(numericValue, 10);
						} else {
							return 0;
						}
					};

					const linkElement = article.querySelectorAll(".link_fs-link__6oAwa") as NodeListOf<HTMLAnchorElement>;
					let linkTitle = '';
					let linkHref = '';
					if (linkElement.length > 0) {
						linkTitle = linkElement[1].title;
						linkHref = linkElement[1].href;
					}

					const img = article.querySelector("img.imagen_plp");
					let imgURL = '';
					if (img) {
						imgURL = img.getAttribute("src") ?? '';
					}

					const priceWithDiscount = article.querySelector(".ProductPrice_container__price__LS1Td");
					const priceWithoutDiscount = article.querySelector(".priceSection_container-promotion_price-dashed__Pzc_z");
					const priceWithCard = article.querySelector(".price_fs-price__7Y_0s");
					const discount = article.querySelector('span[data-percentage="true"]');
					const brandName = article.querySelector(".BrandName_BrandNameTitle__9LquF");

					const body: CouponScraped = {
						name: linkTitle,
						url: linkHref,
						images: imgURL ? [imgURL] : [],
						lowPrice: convertToNumber(priceWithDiscount?.textContent),
						discountWithCard: convertToNumber(priceWithCard?.textContent),
						discountPercentage: convertToNumber(discount?.textContent),
						brandName: brandName?.textContent,
						priceWithoutDiscount: convertToNumber(priceWithoutDiscount?.textContent),
					};
					return body;
				})
			);

			console.log("4 paso 1");
			products = products.concat(data);
			console.log("4 paso 2");

			const nextButton = await page.$(
				".Pagination_nextPreviousLink__UYeAp"
			);
			console.log("4 paso 3");
			if (nextButton) {
				console.log("4 paso if");
				await nextButton.dispatchEvent('click');
			} else {
				console.log("4 paso else");
				break;
			}
		}
		console.log("paso");
		const parsedProducts: DBCoupon[] = products.map((e) => ({
			...e,
			commerce: commerceId,
			category: categoryId,
		}));
		console.log("volvio a pasar");
		const filteredProducts = Array.from(
			new Set(parsedProducts.map((div: DBCoupon) => JSON.stringify(div)))
		)
			.map((div: string) => JSON.parse(div) as DBCoupon)
			.filter(
				({ priceWithoutDiscount, discountPercentage }) =>
					priceWithoutDiscount || discountPercentage
			);
		console.log("DIOS MIOOOO PASOOO");
		await saveCoupons({
			categoryId,
			commerceId,
			data: filteredProducts,
		});
		console.log(url, "SE SCRAPEOOOOOOOOOOOOOOOOOOO");

		await logger(LogType.SUCCESS, "Exito scrapeado correctamente");
		return true;
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
	}
};
