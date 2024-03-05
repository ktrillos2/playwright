import locateChrome from "locate-chrome";
import Chromium from "chrome-aws-lambda";

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
	const browser = await Chromium.puppeteer.launch({
		ignoreDefaultArgs: ['--disable-extensions'],
		args: Chromium.args,
		defaultViewport: Chromium.defaultViewport,
		executablePath: await Chromium.executablePath,
		ignoreHTTPSErrors: true,
	});

	console.log("uwu")
	return browser;
};
