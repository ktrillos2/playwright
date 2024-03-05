import locateChrome from "locate-chrome";
import * as pup from "puppeteer";
import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";

const getLocateChrome = async () => {
	let localeChrome: string | null = await locateChrome();
	if (!localeChrome) throw new Error("No se encontró el path de Chrome");
	return localeChrome;
};

export const getBrowser = async () => {
	const locateBrowser = await getLocateChrome();
	let puppeteerMode;
	if (process.env.NODE_ENV === "production") {
		puppeteerMode = puppeteer;
	} else {
		puppeteerMode = pup;
	}
	const browser = await puppeteerMode.launch({
		// args: [
		// 	"--disable-setuid-sandbox",
		// 	// "--no-sandbox",
		// 	"--single-process",
		// 	"--no-zygote",
		// ],
		// headless: false,
		args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
		defaultViewport: chrome.defaultViewport,
		executablePath: await chrome.executablePath,
		headless: true,
		ignoreHTTPSErrors: true,
	});

	return browser;
};
