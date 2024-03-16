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
		await generalService.scrappingData({
			linkParams: links[1].value,
			page: "Pita Ibiza",
		});

		router.refresh();
		router.push("/inmuebles");
	};

	useEffect(() => {
		scrapeData();
	}, []);

	return (
		<LoadingScraper text="Scrapeando data para nuevos inmuebles, por favor espere..." />
	);
}
