"use client";
import { redirect, useRouter } from "next/navigation";

import { generalService } from "@/service";
import { links } from "@/constants";
import { revalidatePath } from "next/cache";
import { useEffect } from "react";
import { LoadingScraper } from "@/components";

export default function CouponsScraperPage() {
	const router = useRouter();

	const scrapeData = async () => {
		await generalService.scrapeExito();

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
