import playwright from "playwright";

export const getBrowser = async () => {
  const browser = await playwright.chromium.launch({
    headless: false,
  });

<<<<<<< HEAD
	const browser = await playwright.chromium.launch({
		// args: [
		// 	"--disable-setuid-sandbox",
		// 	"--no-sandbox",
		// 	"--single-process",
		// 	"--no-zygote",
		// ],
		 headless: false,
		// executablePath:
		// 	process.env.NODE_ENV === "production"
		// 		? process.env.PUPPETEER_EXECUTABLE_PATH
		// 		: locateBrowser,
	});

	return browser;
};
=======
  return browser;
};
>>>>>>> main
