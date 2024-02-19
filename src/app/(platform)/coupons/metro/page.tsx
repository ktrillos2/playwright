"use client";
import { useRouter } from "next/navigation";

import { generalService } from "@/service";
import { links } from "@/constants";
import { useEffect } from "react";
import { LoadingScraper } from "@/components";

export default function CouponsScraperMetro() {
	const router = useRouter();

	const scrapeData = async () => {
		await generalService.scrapeMetro();
        router.refresh();
		router.push("/coupons");
	};

	useEffect(() => {
		scrapeData();
	}, []);

	return (
		<LoadingScraper text="Scrapeando data para nuevos cupones, por favor espere..." />
	);
}
