"use client";
import { useRouter } from "next/navigation";

import { generalService } from "@/service";
import { links } from "@/constants";
import { useEffect } from "react";
import { LoadingScraper } from "@/components";
import toast from "react-hot-toast";

export default function CouponsScraperMetro() {
  const router = useRouter();

  const scrapeData = async () => {
    await generalService.scrapeMetro();
    router.refresh();
    router.push("/coupons");
    toast.success("Scrapeo completado");
  };

  useEffect(() => {
    scrapeData();
  }, []);

  return (
    <LoadingScraper text="Scrapeando data para nuevos cupones, por favor espere..." />
  );
}
