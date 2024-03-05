import locateChrome from "locate-chrome";
import Chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { PUPPETEER_EXECUTABLE_PATH } from "@/config";

const getLocateChrome = async () => {
	let localeChrome: string | null = await locateChrome();
	if (!localeChrome) throw new Error("No se encontró el path de Chrome");
	return localeChrome;
};

export const getBrowser = async () => {
	// const locateBrowser = await getLocateChrome();
	// let puppeteerMode;
	// if (process.env.NODE_ENV === "production") {
	// 	puppeteerMode = puppeteer;
	// } else {
	// 	puppeteerMode = pup;
	// }
	console.log("holi")
	const browser = await puppeteer.launch({
		ignoreDefaultArgs: ['--disable-extensions'],
		args: Chromium.args,
		defaultViewport: Chromium.defaultViewport,
		executablePath: process.env.NODE_ENV === "production"
		? process.env.PUPPETEER_EXECUTABLE_PATH
		: await Chromium.executablePath,
		ignoreHTTPSErrors: true,
	});

	console.log("uwu")
	return browser;
};
