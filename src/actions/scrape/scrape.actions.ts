"use server";
import { commerceActions } from "@/actions";
import { CommerceSlugs } from "@/enums";
import { getBrowser } from "./helpers";
import { exitoActions } from "./commerces";

const sleep = function (ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const funcion = async (text: string) => {
  await sleep(3000);
  return text;
};

export const scrapeCommerceByCategory = async (
  commerceId: string,
  categoryId: string
) => {
  const commerce = await commerceActions.getCommerceById(commerceId);

  if (!commerce) throw new Error("El comercio seleccionado no existe");

  const { url, queries, slug } = commerce;

  const path = commerce?.categories.find(
    (e) => e.category === categoryId
  )?.path;

  const scrapUrl = `${url}/${path}/${queries}`;

  const browser = await getBrowser();

  const scraperProps = {
    browser,
    url: scrapUrl,
    commerceId,
    categoryId,
  };

  switch (slug) {
    case CommerceSlugs.EXITO:
      await exitoActions.scrapeExito(scraperProps);
      break;
    case CommerceSlugs.METRO:
      break;
    default:
      throw new Error("No hay acciones para este comercio");
  }

  return scrapUrl;
};
