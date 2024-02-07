import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

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
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://pitaibizainmobiliaria.com.co/inmuebles/");
    let data: any = [];
    let lastPageText: any = "";

    do {
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
          return { h4: h4Text, p: pText, span: spanText, bgImage: bgImageUrl };
        })
      );
      data = [...data, ...pageData];
      const nextPage = await page.waitForSelector("#siguienteA");
      const lastPage = await page.waitForSelector("#finalA");
      lastPageText = await page.evaluate((el) => el?.textContent, lastPage);
      await Promise.all([
        nextPage?.click(),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);
    } while (!page.url().includes("2"));

    await page.close();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 200 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
