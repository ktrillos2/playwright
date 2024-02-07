import { NextResponse } from "next/server";
import puppeteer, { Page } from "puppeteer";
import { proxies } from "../constants/proxies.constant";

export async function POST(request: Request) {
  let currentProxyIndex = 0;
  try {
    const urls = Array.from({ length: 15 }, (_, i) => i === 0 ? `https://pitaibizainmobiliaria.com.co/inmuebles/?sheeta=${i + 2}` : `https://pitaibizainmobiliaria.com.co/inmuebles/?sheeta=${i + 3}`);
    let data: any = new Set(); // Cambiamos data a un Set
    console.log(urls)

    const browserPromises = urls.map(async (url, index) => {
      const proxyUrl = proxies[Math.floor(Math.random() * 2)]; // Obtenemos un proxy diferente para cada navegador
      const browser = await puppeteer.launch({
        args: [`--proxy-server=http://72.10.164.178:15697	`], // Pasamos la URL del proxy a Puppeteer
      });
      const page = await browser.newPage();
      await page.goto(url);
      const pageData = await getDataFromPage(page);
      await page.close();
      await browser.close();
      return pageData;
    });

    const results = await Promise.all(browserPromises);
    results.forEach(result => result.forEach(item => data.add(JSON.stringify(item)))); // Añadimos cada elemento al Set

    return NextResponse.json({ data: Array.from(data).map(item => JSON.parse(item)) }, { status: 200 }); // Convertimos el Set de nuevo a un array y parseamos cada elemento a un objeto
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 200 }
    );
  }
}

const getDataFromPage = async (page: Page) => {
  const pageData = await page.$$eval("div.card-in-list", (cards) =>
    cards.map((card) => {
      const h4Text = card.querySelector("h4")?.textContent;
      const pText = card.querySelector("div > p")?.textContent;
      const spanText = card.querySelector("div.img > span")?.textContent;
      const imgDiv = card.querySelector("div.img");
      let bgImageUrl = imgDiv
        ? window.getComputedStyle(imgDiv).backgroundImage
        : null;
      if (bgImageUrl) {
        const match = bgImageUrl.match(/url\("([^"]*)"\)/);
        bgImageUrl = match ? match[1] : null;
      }
      return {
        h4: h4Text,
        p: pText,
        span: spanText,
        bgImage: bgImageUrl,
      };
    })
  );
  console.log(pageData);
  return pageData
};