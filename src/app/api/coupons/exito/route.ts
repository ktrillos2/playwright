import { CouponScraped } from "@/actions/scrape/commerces/exito.actions";
import { getBrowser, logger, saveCoupons } from "@/actions/scrape/helpers";
import {
	DBCoupon,
	LogType,
} from "@/interfaces";
import locateChrome from "locate-chrome";
import { NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";

const getLocateChrome = async () => {
	let localeChrome: string | null = await locateChrome();
	if (!localeChrome) throw new Error("No se encontró el path de Chrome");
	return localeChrome;
};

export async function POST(request: Request) {
	const body = await request.json();
	console.log(body)
	const { url, category, commerce } = body;
	return getData(url, category, commerce);
}

const getData = async (
	url: string,
	categoryId: string,
	commerceId: string
) => {
	const browser = await getBrowser();
	try {
		let products: CouponScraped[] = [];

		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "networkidle0" });
		for (let i = 0; i < 2; i++) {
			console.log("entro a for.")
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

					const linkElement = article.querySelectorAll(
						".link_fs-link__6oAwa"
					) as NodeListOf<HTMLAnchorElement>;

					const img = article.querySelector(
						'img[decoding="async"]'
					) as HTMLImageElement;
					const priceWithDiscount = article.querySelector(
						".ProductPrice_container__price__LS1Td"
					);
					const priceWithoutDiscount = article.querySelector(
						".priceSection_container-promotion_price-dashed__Pzc_z"
					);
					const priceWithCard = article.querySelector(
						".price_fs-price__7Y_0s"
					);
					const discount = article.querySelector(
						'span[data-percentage="true"]'
					);
					const brandName = article.querySelector(
						".BrandName_BrandNameTitle__9LquF"
					);
					const imgURL = img ? new URL(img.src) : null;
					const decodedPath = imgURL
						? decodeURIComponent(
							imgURL.searchParams.get("url") || ""
						)
						: null;

					const body: CouponScraped = {
						name: linkElement[1].title,
						url: linkElement[1].href,
						images: decodedPath ? [decodedPath] : [],
						lowPrice: convertToNumber(
							priceWithDiscount?.textContent
						),
						discountWithCard: convertToNumber(
							priceWithCard?.textContent
						),
						discountPercentage: convertToNumber(
							discount?.textContent
						),
						brandName: brandName?.textContent,
						priceWithoutDiscount: convertToNumber(
							priceWithoutDiscount?.textContent
						),
					};
					return body;
				})
			);

			products = products.concat(data);

			const nextButton = await page.$(
				".Pagination_nextPreviousLink__UYeAp"
			);
			if (nextButton) {
				await nextButton.click();
				await page.waitForNavigation();
			} else {
				break;
			}
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
		// await saveCoupons({
		// 	categoryId,
		// 	commerceId,
		// 	data: filteredProducts,
		// });

		console.log(filteredProducts)
		await logger(LogType.SUCCESS, "Exito scrapeado correctamente");
		return NextResponse.json({ Products: filteredProducts }, { status: 200 })

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
