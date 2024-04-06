"use server";
import { commerceActions } from "@/actions";
import { CommerceSlugs } from "@/enums";
import { getBrowser } from "./helpers";
import { exitoActions, metroActions, koajActions  } from "./commerces";

export const scrapeCommerceByCategory = async (
  commerceId: string,
  categoryId: string
): Promise<number> => {
  const commerce = await commerceActions.getCommerceById(commerceId);
  if (!commerce) throw new Error("El comercio seleccionado no existe");

  const { url, queries, slug } = commerce;
  console.log(url)

  const path = commerce?.categories.find(
    (e) => e.category === categoryId
  )?.path;

  let scrapUrl

  if (!url.includes('koaj')) { 

    scrapUrl = `${url}/${path}/${queries}`;
  } else {
    
    scrapUrl = url;
  }

  const browser = await getBrowser();

  const scraperProps = {
    browser,
    url: scrapUrl,
    commerceId,
    categoryId,
  };

  switch (slug) {
    case CommerceSlugs.EXITO:
      return await exitoActions.scrapeExito(scraperProps);
    case CommerceSlugs.METRO:
      return await metroActions.scrapeMetro(scraperProps);
    case CommerceSlugs.KOAJ:
      return await koajActions.scrapeKoaj(scraperProps);
    default:
      throw new Error("No hay acciones para este comercio");
  }
};
