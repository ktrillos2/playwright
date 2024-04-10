"use client";

import React from "react";
import { CardImage } from "./CardImage";
import { PagePaths } from "@/enums";
import { Divider } from "@nextui-org/react";

export const HomeComponent = () => {
  return (
    <div className="max-w-[800px] mx-auto">
      <h1 className="text-center font-bold text-3xl md:text-4xl">
        Bienvenido/a al KumoScraper
      </h1>
      <p className="text-center text-md md:text-lg">¿Qué deseas hacer hoy?</p>
      <Divider  className="my-2"/>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-4 mt-2 md:mt-4">
        <CardImage
          image={"/home/products.webp"}
          text="Ver productos"
          href={PagePaths.COUPONS}
        />
        <CardImage
          image={"/home/scraping.webp"}
          text="Scrapear productos"
          href={PagePaths.COUPONS_SCRAPER}
        />
        <CardImage
          image={"/home/commerces.webp"}
          text="Administrar comercios"
          href={PagePaths.COMMERCES}
        />
         <CardImage
          image={"/home/create-commerce.webp"}
          text="Crear comercio"
          href={PagePaths.CREATE_COMMERCE}
        />
      </div>
    </div>
  );
};
