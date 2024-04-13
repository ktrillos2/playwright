import { Page } from "playwright";

export const autoScroll = async (page: Page) => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        const oldScrollY = window.scrollY;
        window.scrollBy(0, distance);
        const newScrollY = window.scrollY;

        if (newScrollY >= scrollHeight || newScrollY === oldScrollY) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};