import { NextResponse } from "next/server";
import puppeteer, { Browser, Page } from "puppeteer";
import { Inmueble } from "../../../interfaces";
import { generalService } from "../../../service";
import { connect } from "../../../../lib";
import { autoScroll } from "@/helpers";

export async function POST(request: Request) {
	const { linkParams: pageScrape, page } = await request.json();
	if (!pageScrape || !page) {
		return NextResponse.json(
			{ error: "Envía un link a scrapear" },
			{ status: 400 }
		);
	}
	let browser: Browser;
	browser = await puppeteer.launch();
	if (page === "Exito") {
		return getDataFromExitoPage(browser, pageScrape);
	} else {
		return getDataFromPitaIbizaPage(browser, pageScrape);
	}
}

// PITA IBIZA
const getDataFromPitaIbizaPage = async (browser: Browser, link: string) => {
	try {
		let data: any[] = [];
		let lastPageText: any = "";
		const page = await browser.newPage();

		setUserAgentAndHeaders(page);

		await page.goto(link);

		do {
			const pageData = await getDataFromPitaIbiza(page);

			data = [...data, ...pageData];

			const nextPage = await page.waitForSelector("#siguienteA");
			const lastPage = await page.waitForSelector("#finalA");
			lastPageText = await page.evaluate(
				(el) => el?.textContent,
				lastPage
			);

			setUserAgentAndHeaders(page);

			await Promise.all([
				nextPage?.click(),
				page.waitForNavigation({ waitUntil: "networkidle0" }),
			]);
		} while (!page.url().includes("2"));

		await page.close();

		saveData(data);

		return NextResponse.json({ data }, { status: 200 });
	} catch (error: any) {
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

const getDataFromPitaIbiza = async (page: Page) => {
	const pageData = await page.$$eval("div.card-in-list", (cards) =>
		cards.map((card) => {
			const name = card.querySelector("h4")?.textContent;
			const location = card.querySelector("div > p")?.textContent;
			const price = card.querySelector("div.img > span")?.textContent;
			const imgDiv = card.querySelector("div.img");
			card.querySelector("div.img > div")?.textContent;
			const path = card.querySelector("a.button")?.getAttribute("href");
			let image = imgDiv
				? window.getComputedStyle(imgDiv).backgroundImage
				: null;
			if (image) {
				const match = image.match(/url\("([^"]*)"\)/);
				image = match ? match[1] : null;
			}
			return {
				name,
				location,
				price,
				image,
				url: `https://pitaibizainmobiliaria.com.co${path}`,
				page: "Pita Ibiza",
			};
		})
	);

	return pageData;
};

// EXITO

const getDataFromExitoPage = async (browser: Browser, link: string) => {
	const page = await browser.newPage();
	await page.goto(link, { waitUntil: "networkidle0" });
	try {
		const preContent = await page.$eval(
			"body pre",
			(element) => element.textContent
		);
		const data = preContent ? JSON.parse(preContent) : null;
		return NextResponse.json({ data: data || {} }, { status: 200 });
	} catch (error: any) {
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

const getDataFromExito = async (page: Page) => {
	const data = await page.evaluate(() => {
		const linkImagesHeader = Array.from(
			document.querySelectorAll("a.link_fs-link__6oAwa")
		).map((a: Element) => (a as HTMLAnchorElement).href);
		const imagesFromHeader = Array.from(
			document.querySelectorAll("a.link_fs-link__6oAwa span img")
		).map((img: Element) => (img as HTMLImageElement).src);
		const sectionPromos = Array.from(
			document.querySelectorAll("section.layout__section")
		);
		const titleSections = sectionPromos.map(
			(section) =>
				section.querySelector(
					"div div.TitleProductShelf_ProductShelfTitle__wh4yq h3"
				)?.textContent
		);
		const viewMoreSections = sectionPromos.map(
			(section) =>
				(section.querySelector("button a") as HTMLAnchorElement)?.href
		);
		const redirectionAndPromoSections = sectionPromos.map((section) => {
			const slides = Array.from(
				section.querySelectorAll(
					"div.ProductShelfRotary_fs-product-shelf__YfQB8 div.swiper div.swiper-wrapper div.swiper-slide"
				)
			);
			return slides.map((slide: Element) => {
				const a = slide.querySelector(
					'article div[data-fs-product-card-image-promotion="true"] div[data-product-card-image="true"] a'
				) as HTMLAnchorElement;
				const promotionDiv = slide.querySelector(
					"div.product-card_container-promotion__Cexgr"
				);
				const p1 = promotionDiv
					? promotionDiv.querySelector("p")?.textContent
					: null;
				const span = promotionDiv
					? promotionDiv.querySelector("span")?.textContent
					: null;
				const p2 = promotionDiv
					? promotionDiv.querySelectorAll("p")[1]?.textContent
					: null;
				return {
					href: a ? a.href : null,
					promotion: p1 && span && p2 ? p1 + span + p2 : null,
				};
			});
		});
		return {
			linkImagesHeader,
			imagesFromHeader,
			titleSections,
			viewMoreSections,
			redirectionAndPromoSections,
		};
	});

	return data;
};

// EXITO TECNOLOGY

const getDataFromExitoTecnologyPage = async (
	browser: Browser,
	link: string
) => {
	let data: any[] = [];

	const page = await browser.newPage();
	await page.goto(link, { waitUntil: "networkidle0" });
	// await autoScroll(page);
	try {
		const pageData = await getDataFromExitoTecnology(page);
		return NextResponse.json({ pageData }, { status: 200 });
	} catch (error: any) {
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

const getDataFromExitoTecnology = async (page: Page) => {
	const data = await page.evaluate(() => {
		const carts = Array.from(
			document.querySelectorAll(
				"div.product-grid_fs-product-grid__SF25P > ul"
			)
		);
		return {};
	});

	return data;
};

// OTHER
const getRandomElement = (array: any[]) => {
	return array[Math.floor(Math.random() * array.length)];
};

const saveData = async (data: Inmueble[]) => {
	try {
		const { Inmueble } = await connect();
		await Inmueble.deleteMany({});
		await Inmueble.insertMany(data);
	} catch (error: any) { }
};

const setUserAgentAndHeaders = async (page: Page) => {
	const userAgents = (await generalService.getUserAgents()).result;
	const browserHeaders = (await generalService.getBrowserHeaders()).result;

	const userAgent = getRandomElement(userAgents);
	const headers = getRandomElement(browserHeaders);

	await page.setUserAgent(userAgent);
	await page.setExtraHTTPHeaders(headers);
};
