"use server";
import { commerceActions } from "@/actions";
import { CommerceSlugs } from "@/enums";
import { getBrowser } from "./helpers";
import { exitoActions, metroActions } from "./commerces";
import { generalService } from "@/service";

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


  const scraperProps = {
    url: scrapUrl,
    commerceId,
    categoryId,
  };
  

  switch (slug) {
    case CommerceSlugs.EXITO:
      await generalService.scrapeExito(null,scraperProps)

      break;
    case CommerceSlugs.METRO:
      await metroActions.scrapeMetro(scraperProps);
      break;
    default:
      throw new Error("No hay acciones para este comercio");
  }

  return scrapUrl;
};
