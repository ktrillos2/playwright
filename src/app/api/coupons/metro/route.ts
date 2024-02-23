import { links } from "@/constants";
import { CouponPages } from "@/enums";
import { autoScroll } from "@/helpers";
import { Coupon, LogCategory, LogType } from "@/interfaces";
import { couponService, dbConnect, logMessageService } from "@/lib";
import locateChrome from "locate-chrome";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";

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
    //! Descomentar para ver la página siendo scrapeada
    // headless: false,
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : locateBrowser,
  });

  return browser;
};

export async function POST(request: Request) {
  const browser = await getBrowser();
  return getData(browser);
}

const getData = async (browser: Browser) => {
  try {
    const page = await browser.newPage();
    await page.goto(links[2].value);
    let products: Coupon[] = [];

    // Obtén todos los botones
    const buttons = await page.$$(
      ".tiendasjumboqaio-metro-fetch-more-paginator-0-x-buttonPerPage" // Selector que tiene cada botón para cambiar de página
    );

    // Itera sobre cada botón
    for (let i = 1; i < 3; i++) {
      await autoScroll(page);
      const newDivs: any = await page.$$eval(
        ".vtex-product-summary-2-x-container", // Selector que tiene cada card de producto
        (divs) =>
          divs.map((div: Element) => {
            const stringToNumber = (text: string = "") => {
              return Number(text.replace(/[^0-9.]/g, "").replaceAll(".", ""));
            };
            const image = div.querySelector("img")?.src;
            const name = div.querySelector("h2 span")?.textContent;
            const [priceWithDiscount, priceWithoutDiscount, discountWithCard] =
              Array.from(
                div.querySelectorAll(
                  ".tiendasjumboqaio-metro-minicart-2-x-price"
                )
              ).map((priceDiv) => priceDiv.innerHTML.replace(/[^0-9.]/g, ""));
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
              priceWithoutDiscount: stringToNumber(priceWithoutDiscount),
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

    //Elimina los duplicados
    products = Array.from(
      new Set(products.map((div: Coupon) => JSON.stringify(div)))
    )
      .map((div: string) => JSON.parse(div) as Coupon)
      .filter(
        ({ priceWithoutDiscount, discountPercentage }) =>
          priceWithoutDiscount || discountPercentage
      );

    await saveCoupons(products);

    await logger(LogType.SUCCESS, "Metro scrapeado correctamente");

    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error: any) {
    await logger(
      LogType.ERROR,
      error?.message ?? "No se pudo scrapear Metro",
      error
    );
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

const saveCoupons = async (data: Coupon[]) => {
  try {
    await dbConnect();
    await couponService.deleteCouponsFromPage(CouponPages.METRO);
    await couponService.saveCoupons(data);
    return true;
  } catch (error: any) {
  }
};

const logger = async (type: LogType, message: string, error?: any) => {
  await dbConnect();
  const response = await logMessageService.createLogMessage({
    category: LogCategory.COUPON,
    type,
    message,
    error,
  });

  revalidatePath("/coupons/scraper");

  return response;
};
