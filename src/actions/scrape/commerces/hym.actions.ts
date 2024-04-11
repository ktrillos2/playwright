import { DBCoupon, LogType } from "@/interfaces";
import { Browser } from "playwright";
import { logger } from "../helpers";
import { autoScroll } from "@/helpers";

export interface ScrapePageProps {
    browser: Browser;
    url: string;
}

export type CouponScraped = Omit<DBCoupon, "commerce" | "category">;

export const scrapeHym = async ({ browser, url }: ScrapePageProps) => {
    let products: CouponScraped[] = [];

    try {

        //* Navega a la página
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });
        await autoScroll(page)
        

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
        return products;
    }
};
