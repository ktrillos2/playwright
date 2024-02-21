"use client";
import { useCallback, useState } from "react";
import { Button, Image, useDisclosure } from "@nextui-org/react";
import { clsx } from "clsx";

import { Columns, CalculatedCoupon, Coupon } from "@/interfaces";
import {
	AsyncCustomTable,
	CopyClipboardButton,
	ModalImage,
} from "@/components";
import { formatToMoney } from "@/helpers";

const columns: Columns[] = [
	{
		key: "page",
		label: "Pagina",
	},
	{
		key: "name",
		label: "Nombre",
	},
	{
		key: "image",
		label: "Imagen",
	},
	{
		key: "discountPercentage",
		label: "Descuento",
	},
	{
		key: "lowPrice",
		label: "Precio con descuento",
	},
	{
		key: "discountWithCard",
		label: "Precio con tarjeta",
	},
	{
		key: "priceWithoutDiscount",
		label: "Precio sin descuento",
	},
	{
		key: "brandName",
		label: "Marca",
	},
	{ key: "url", label: "Link" },
	{
		key: "options",
		label: "Opciones",
	},
];

interface Props {
	coupons: Coupon[];
	page: number;
	totalPages: number;
	totalInmuebles: number;
	limit: number;
}

export const CouponsTable: React.FC<Props> = ({
	coupons,
	page,
	totalPages,
	totalInmuebles,
	limit,
}) => {
	const [selectedInfo, setSelectedInfo] = useState<CalculatedCoupon | null>(
		null
	);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const renderCell = useCallback(
		(data: any, columnKey: React.Key) => {
			const cellValue = data[columnKey as keyof any];
			const { images, image, url } = data;

			if (columnKey === "image") {
				return images ? (
					<div className="w-[80px]">
						<Image
							src={images[0]}
							alt="image"
							className="!w-full"
						></Image>
					</div>
				) : (
					<Image
						src={image}
						alt="image"
						className="!w-[90px]"
					></Image>
				);
			}

			if (columnKey === "url") {
				return (
					<div className="flex gap-2">
						<Button onClick={() => window.open(url, "_blank")}>
							Ver más
						</Button>
						<CopyClipboardButton content={url} />
					</div>
				);
			}

			if (columnKey === "discountPercentage") {
				return (
					<span
						className={clsx({
							"text-success-500": cellValue >= 50,
						})}
					>
						{cellValue} %
					</span>
				);
			}

			if (
				["lowPrice", "discountWithCard", "priceWithoutDiscount"].includes(
					columnKey as string
				)
			) {
				return formatToMoney(cellValue);
			}

			if (columnKey === "options") {
				return (
					<Button
						onClick={() => {
							onOpen();
							setSelectedInfo(data);
						}}
					>
						Ver cupón
					</Button>
				);
			}

			return cellValue;
		},
		[onOpen]
	);

	return (
		<>
			<ModalImage
				isOpen={isOpen}
				info={selectedInfo!}
				onOpenChange={onOpenChange}
			/>
			<AsyncCustomTable
				items={coupons ?? []}
				columns={columns}
				renderCell={renderCell}
				page={page}
				totalPages={totalPages}
				totalItems={totalInmuebles}
				limit={limit}
				itemsName="cupones"
			/>
		</>
	);
};
