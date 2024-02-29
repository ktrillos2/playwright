import { CouponPages } from "@/enums";
import { Coupon, LogCategory, LogType } from "@/interfaces";
import { couponService, dbConnect, logMessageService } from "@/lib";
import { revalidatePath } from "next/cache";
import { Browser } from "puppeteer";

interface ScrapePageProps {
  browser: Browser;
  url: string;
  commerceId: string;
  categoryId: string;
}

export const scrapeExito = async ({
  browser,
  url,
  categoryId,
  commerceId,
}: ScrapePageProps) => {
  try {
    let products: Coupon[] = [];

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    for (let i = 0; i < 2; i++) {
      // await autoScroll(page);
      const data = await page.$$eval("article", (articles) =>
        articles.map((article: Element) => {
          const convertToNumber = (item: string | null | undefined) => {
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
          const priceWithCard = article.querySelector(".price_fs-price__7Y_0s");
          const discount = article.querySelector(
            'span[data-percentage="true"]'
          );
          const brandName = article.querySelector(
            ".BrandName_BrandNameTitle__9LquF"
          );
          const imgURL = img ? new URL(img.src) : null;
          const decodedPath = imgURL
            ? decodeURIComponent(imgURL.searchParams.get("url") || "")
            : null;
          const body: Coupon = {
            name: linkElement[1].title,
            url: linkElement[1].href,
            images: decodedPath ? [decodedPath] : [],
            lowPrice: convertToNumber(priceWithDiscount?.textContent),
            discountWithCard: convertToNumber(priceWithCard?.textContent),
            discountPercentage: convertToNumber(discount?.textContent),
            brandName: brandName?.textContent,
            priceWithoutDiscount: convertToNumber(
              priceWithoutDiscount?.textContent
            ),
            page: "EXITO",
          };
          return body;
        })
      );

      // const dataparsed = data.map((e) => ({...e, commerceId, categoryId})

      products = products.concat(data);

      const nextButton = await page.$(".Pagination_nextPreviousLink__UYeAp");
      if (nextButton) {
        await nextButton.click();
        await page.waitForNavigation({ waitUntil: "networkidle0" });
      } else {
        break;
      }
    }
    products = Array.from(
      new Set(products.map((div: Coupon) => JSON.stringify(div)))
    )
      .map((div: string) => JSON.parse(div) as Coupon)
      .filter(
        ({ priceWithoutDiscount, discountPercentage }) =>
          priceWithoutDiscount || discountPercentage
      );

    await saveCoupons(products);
    await logger(LogType.SUCCESS, "Exito scrapeado correctamente");
    console.log("bien");
    return true;
  } catch (error: any) {
    console.log(error);
    await logger(
      LogType.ERROR,
      error?.message ?? "No se pudo scrapear Exito",
      error
    );

    throw new error();
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const saveCoupons = async (data: Coupon[]) => {
  try {
    await dbConnect();
    await couponService.deleteCouponsFromPage(CouponPages.EXITO);
    await couponService.saveCoupons(data);
    return true;
  } catch (error: any) {
    throw error;
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
