import { links } from "@/constants";
import { CouponPages } from "@/enums";
import { Coupon, PromosTecnologyExitoData, Variables } from "@/interfaces";
import { couponService, dbConnect } from "@/lib";
import locateChrome from "locate-chrome";
import { NextResponse } from "next/server";
import puppeteer, { Browser, Page } from "puppeteer";

const getLocateChrome = async () => {
	let localeChrome: string | null = await locateChrome();
	if (!localeChrome) throw new Error("No se encontró el path de Chrome");
	return localeChrome;
};

const getBrowser = async () => {
	const locateBrowser = await getLocateChrome();

	const browser = await puppeteer.launch({
		args: [
			"--disable-setuid-sandbox",
			"--no-sandbox",
			"--single-process",
			"--no-zygote",
		],
		executablePath:
			process.env.NODE_ENV === "production"
				? process.env.PUPPETEER_EXECUTABLE_PATH
				: locateBrowser,
	});

	return browser;
};

const updateUrlVariables = (url: string, { after }: Variables) => {
	const regex = /("after"%3A")(\d+?)("%2C)/;

	// Reemplaza el valor actual de 'after' con el nuevo valor
	const updatedUrl = url.replace(regex, `$1${after}$3`);

	return updatedUrl;
};

const extractAfterFromUrl = (url: string) => {
	// Parsea la URL y sus parámetros
	const urlObj = new URL(url);
	const params = new URLSearchParams(urlObj.search);

	// Obtiene las variables actuales
	const currentVariables = JSON.parse(
		decodeURIComponent(params.get("variables") ?? "")
	);

	// Devuelve el valor de 'after'
	return Number(currentVariables.after);
};

export async function POST(request: Request) {
	const browser = await getBrowser();
	const link = links[0].value;
	return getData(browser, link);
}

const getData = async (browser: Browser, link: string) => {
	try {
		let productsPromo: any[] = [];
		console.log("entro");
		let limitUrl = extractAfterFromUrl(link);
		console.log("salio");
		let totalCounts;
		let products;
		do {
			const page = await browser.newPage();
			await page.goto(link, { waitUntil: "networkidle0" });
			const preContent = await page.$eval(
				"body pre",
				(element) => element.textContent
			);

			if (!preContent) throw new Error("No se encontró el contenido");

			const preContentOb: PromosTecnologyExitoData = JSON.parse(
				preContent ?? "{}"
			);

			products = preContentOb.data.search.products.edges;
			totalCounts = preContentOb.data.search.products.pageInfo.totalCount;
			products.forEach((product) => {
				const {
					node: {
						name,
						brand: { brandName },
						image,
						offers: { lowPrice },
						sellers,
						breadcrumbList: { itemListElement },
					},
				} = product;

				let sellerData = null;

				for (let i = 0; i < sellers.length; i++) {
					const {
						sellerName,
						commertialOffer: {
							PriceWithoutDiscount: priceWithoutDiscount,
							teasers,
						},
					} = sellers[i];
					let discountWithCard = null;

					teasers?.forEach((teaser) => {
						const {
							effects: { parameters },
						} = teaser;
						parameters.forEach((parameter) => {
							const { name, value } = parameter;
							if (name === "PromotionalPriceTableItemsDiscount") {
								discountWithCard = +value;
              }
						});
					});

					if (discountWithCard !== null) {
						const discountPercentage = Math.round(
							(discountWithCard / priceWithoutDiscount) * 100
						);
						sellerData = {
							priceWithoutDiscount,
							discountPercentage,
							discountWithCard,
            };
						break;
					}
				}

				const images = image?.map(({ url }: any) => url);
				let data: any;
				if (sellerData !== null) {
					data = {
						name,
						brandName,
						images,
						lowPrice,
						url:
							"https://www.exito.com" +
							itemListElement[itemListElement.length - 1].item,
						...sellerData,
						page: "EXITO",
					};
				}
				if (data) productsPromo.push(data);
			});
			// Actualiza la URL para la próxima iteración
			limitUrl += 16;
			link = updateUrlVariables(link, { after: limitUrl.toString() });
		} while (limitUrl < totalCounts);
		await saveCoupons(productsPromo);

		return NextResponse.json({ data: productsPromo }, { status: 200 });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json(
			{ error: "Ha ocurrido un error", possibleError: error?.message },
			{ status: 500 }
		);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
};

export const saveCoupons = async (data: Coupon[]) => {
	try {
		await dbConnect();
    await couponService.deleteCouponsFromPage(CouponPages.EXITO);
    console.log(data)
		await couponService.saveCoupons(data);
		return true;
	} catch (error: any) {
		throw error;
	}
};
