"use client";

import React from "react";
import { CardImage } from "./CardImage";
import { PagePaths } from "@/enums";

export const HomeComponent = () => {
  return (
    <div className="max-w-[800px] mx-auto">
      <h1 className="text-center font-bold text-4xl">
        Bienvenido/a al KumoScraper
      </h1>
      <p className="text-center text-lg">¿Qué deseas hacer hoy?</p>
      <div className="flex justify-center gap-2 md:gap-4 mt-2 md:mt-4">
        <CardImage
          image={"/products.webp"}
          text="Ver productos"
          href={PagePaths.COUPONS}
        />
        <CardImage
          image={"/scraping.webp"}
          text="Scrapear productos"
          href={PagePaths.COUPONS_SCRAPER}
        />
      </div>
    </div>
  );
};
