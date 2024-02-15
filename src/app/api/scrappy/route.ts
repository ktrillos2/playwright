import { NextResponse } from "next/server";
import puppeteer, { Browser, Page } from "puppeteer";
import {
  Inmueble,
  PromosTecnologyExito,
  PromosTecnologyExitoData,
  Variables,
} from "../../../interfaces";
import { generalService } from "../../../service";
import { autoScroll } from "@/helpers";
import { dbConnect, inmuebleService } from "@/app/lib";
import locateChrome from "locate-chrome";

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

export async function POST(request: Request) {
  const { linkParams: pageScrape, page } = await request.json();
  if (!pageScrape || !page) {
    return NextResponse.json(
      { error: "Envía un link a scrapear" },
      { status: 400 }
    );
  }

	const browser = await getBrowser();

  if (page === "Exito") {
    return getDataFromExitoPage(browser, pageScrape);
  } else {
    return getDataFromPitaIbizaPage(browser, pageScrape);
  }
}

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
      lastPageText = await page.evaluate((el) => el?.textContent, lastPage);

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
  try {
    let productsPromo: any[] = [];
    let limitUrl = extractAfterFromUrl(link);
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
            const priceWithCard = priceWithoutDiscount - discountWithCard;
            const discountPercentage = Math.round(
              (discountWithCard / priceWithoutDiscount) * 100
            );
            sellerData = {
              sellerName,
              priceWithCard,
              priceWithoutDiscount,
              discountPercentage,
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
            // options: "options",
          };
        }
        productsPromo.push(data);
      });
      // Actualiza la URL para la próxima iteración
      limitUrl += 16;
      link = updateUrlVariables(link, { after: limitUrl.toString() });
    } while (limitUrl < totalCounts);

    return NextResponse.json({ data: productsPromo }, { status: 200 });
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
      document.querySelectorAll("div.product-grid_fs-product-grid__SF25P > ul")
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
    await dbConnect();
    await inmuebleService.deleteAllInmuebles();
    await inmuebleService.saveInmuebles(data);
  } catch (error: any) {}
};

const setUserAgentAndHeaders = async (page: Page) => {
  const userAgents = (await generalService.getUserAgents()).result;
  const browserHeaders = (await generalService.getBrowserHeaders()).result;

  const userAgent = getRandomElement(userAgents);
  const headers = getRandomElement(browserHeaders);

  await page.setUserAgent(userAgent);
  await page.setExtraHTTPHeaders(headers);
};
