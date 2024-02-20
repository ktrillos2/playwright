"use client";
import { redirect, useRouter } from "next/navigation";

import { generalService } from "@/service";
import { links } from "@/constants";
import { revalidatePath } from "next/cache";
import { useCallback, useEffect, useState } from "react";
import { LoadingScraper } from "@/components";
import {
	Button,
	Image,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import { Columns } from "@/interfaces";
import { CouponPages } from "@/enums";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import loadingAnimation from "../../../../../public/lottie/loading.json";

const columns: Columns[] = [
	{
		key: "image",
		label: "Imagen",
	},
	{
		key: "label",
		label: "Label",
	},
	{
		key: "actions",
		label: "Acciones",
	},
	{
		key: "loading",
		label: "Cargando",
	},
];

const COUPON_PAGES = [
	{
		key: CouponPages.EXITO,
		label: "Exito",
		image: "/page-images/exito-logo.png",
	},
	{
		key: CouponPages.METRO,
		label: "Metro",
		image: "/page-images/metro-logo.png",
	},
];

export default function CouponsScraperPage() {
	const router = useRouter();

	const [loadingState, setLoadingState] = useState<
		Record<CouponPages, boolean>
	>({
		[CouponPages.EXITO]: false,
		[CouponPages.METRO]: false,
	});

	const [forceUpdate, setForceUpdate] = useState(false);

	useEffect(() => {
		setForceUpdate(!forceUpdate);
	}, [loadingState]);
	const handleScrape = async (page: CouponPages) => {
		setLoadingState((prev) => ({
			...prev,
			[page]: true,
		}));
		try {
			if (page === CouponPages.EXITO) {
				await generalService.scrapeExito();
			}
			if (page === CouponPages.METRO) await generalService.scrapeMetro();
			toast.success(
				`Se ha scrapeado: ${page.toLowerCase()} correctamente`
			);
		} catch (error) {
			toast.error(
				`Error al scrapear: ${page.toLowerCase()}, vuelve a intentarlo`
			);
		} finally {
			setLoadingState((prev) => ({ ...prev, [page]: false }));
		}
	};

	const renderCell = useCallback(
		(data: any, columnKey: React.Key) => {
			const cellValue = data[columnKey as keyof any];

			const { image, key } = data;
			switch (columnKey) {
				case "image":
					return (
						<Image
							src={image}
							alt="image"
							className="!w-[90px]"
						></Image>
					);
				case "actions":
					return (
						<Button
							onClick={() => handleScrape(key as CouponPages)}
							disabled={loadingState[key as CouponPages]}
						>
							{loadingState[key as CouponPages]
								? "Scrapeando..."
								: "Scrapear"}
						</Button>
					);
				case "loading":
					return loadingState[key as CouponPages] ? (
						<div className="max-w-48">
							<Lottie
								animationData={loadingAnimation}
								loop={true}
								className="max-w-1/2"
							/>
						</div>
					) : (
						"No se esta cargando"
					);
				default:
					return cellValue;
			}
		},
		[loadingState]
	);

	return (
		<div>
			<Table
				aria-label="Example table with dynamic content"
				key={forceUpdate.toString()}
			>
				<TableHeader>
					{columns.map((column) => (
						<TableColumn key={column.key}>
							{column.label}
						</TableColumn>
					))}
				</TableHeader>
				<TableBody items={COUPON_PAGES}>
					{(item) => (
						<TableRow key={item.key}>
							{(columnKey) => (
								<TableCell className="max-w-[100px]">
									{renderCell(item, columnKey)}
								</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
