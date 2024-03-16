import locateChrome from "locate-chrome";
import puppeteer from "puppeteer";
import playwright from 'playwright';

const getLocateChrome = async () => {
	let localeChrome: string | null = await locateChrome();
	if (!localeChrome) throw new Error("No se encontró el path de Chrome");
	return localeChrome;
};

export const getBrowser = async () => {
	// const locateBrowser = await getLocateChrome();

	const browser = await playwright.chromium.launch({
		// args: [
		// 	"--disable-setuid-sandbox",
		// 	"--no-sandbox",
		// 	"--single-process",
		// 	"--no-zygote",
		// ],
		// headless: false,
		// executablePath:
		// 	process.env.NODE_ENV === "production"
		// 		? process.env.PUPPETEER_EXECUTABLE_PATH
		// 		: locateBrowser,
	});

	return browser;
};