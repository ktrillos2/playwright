import { NextResponse } from "next/server";
import puppeteer, { Page } from "puppeteer";
import { Inmueble } from "../interfaces";
import { generalService } from "../service";
import { connect } from "../../lib";

export async function POST(request: Request) {
  // const { searchParams: userSearch } = await request.json();

  // if (!userSearch) {
  //   return NextResponse.json(
  //     { error: "Please provide a search query" },
  //     { status: 400 }
  //   );
  // }

  let browser;
  try {
    browser = await puppeteer.launch({
      // args: [`--proxy-server=http://154.6.96.222:3128`],
    });
    const page = await browser.newPage();

    const userAgents = (await generalService.getUserAgents()).result;
    const browserHeaders = (await generalService.getBrowserHeaders()).result;

    const userAgent = getRandomElement(userAgents);
    const headers = getRandomElement(browserHeaders);

    await page.setUserAgent(userAgent);
    await page.setExtraHTTPHeaders(headers);

    await page.goto("https://pitaibizainmobiliaria.com.co/inmuebles/");

    let data: any[] = [];
    let lastPageText: any = "";

    do {
      const pageData = await getDataFromPitaIbiza(page);

      data = [...data, ...pageData];

      const nextPage = await page.waitForSelector("#siguienteA");
      const lastPage = await page.waitForSelector("#finalA");
      lastPageText = await page.evaluate((el) => el?.textContent, lastPage);

      const userAgent = getRandomElement(userAgents);
      const headers = getRandomElement(browserHeaders);

      await page.setUserAgent(userAgent);
      await page.setExtraHTTPHeaders(headers);

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
}

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

const getRandomElement = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const saveData = async (data: Inmueble[]) => {
  try {
    const { Inmueble } = await connect();
    await Inmueble.deleteMany({});
    await Inmueble.insertMany(data);
  } catch (error: any) {}
};
