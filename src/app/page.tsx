// Archivo: page.tsx
"use client";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";

import Lottie from "lottie-react";

import loadingAnimation from "../../public/lottie/loading.json";
import errorAnimation from "../../public/lottie/error.json";

import { generalService } from "../service";
import { Columns, Exito, Inmueble, PromosTecnologyExito } from "../interfaces";
import { CustomTable } from "../components";
import { links } from "../constants";

const columnsPitaIbiza: Columns[] = [
	{
		key: "page",
		label: "Inmobiliaria",
	},
	{
		key: "name",
		label: "Nombre",
	},
	{
		key: "location",
		label: "Ubicación",
	},
	{
		key: "price",
		label: "Precio",
	},
	{
		key: "image",
		label: "Imagen",
	},
	{
		key: "url",
		label: "Detalles",
	},
];

const columnsExito: Columns[] = [
	{
		key: "name",
		label: "Nombre",
	},
	{
		key: "brandName",
		label: "Marca",
	},
	{
		key: "image",
		label: "Imagen",
	},
	{
		key: "lowPrice",
		label: "Precio con descuento",
	},
	{
		key: "discountPercentage",
		label: "porcentaje de descuento",
	},
	{
		key: "priceWithCard",
		label: "Precio con tarjeta",
	},
	{
		key: "PriceWithoutDiscount",
		label: "Precio sin descuento",
	},
];

export default function Home() {
	const [inmuebles, setInmuebles] = useState<Inmueble[]>();
	const [exitoPage, setExitoPage] = useState<Exito[]>();
	const [pageUrl, setPageUrl] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | any>(null);

	const scrapePages = async () => {
		setIsLoading(true);
		setError(null);
		try {
			if (pageUrl === links[0].value) {
				setDataExito();
			} else {
				setDataPitaIbiza();
			}
		} catch (error: any) {
			console.log(error);
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const setDataPitaIbiza = async () => {
		const response = await generalService.scrappingData({
			linkParams: pageUrl,
			page: "Pita Ibiza",
		});
		setInmuebles(response.data);
	};

	const setDataExito = async () => {
		const response: PromosTecnologyExito =
			await generalService.scrappingData({
				linkParams: pageUrl,
				page: "Exito",
			});
		const {
			data: {
				data: {
					search: {
						products: { edges: products },
					},
				},
			},
		} = response;
		let productsPromo: any[] = [];
		products.forEach((product) => {
			const {
				node: {
					name,
					brand: { brandName },
					image,
					offers: { lowPrice },
					sellers,
				},
			} = product;

			let sellerData = null;

			for (let i = 0; i < sellers.length; i++) {
				const {
					sellerName,
					commertialOffer: { PriceWithoutDiscount, teasers },
				} = sellers[i];
				let discountWithCard = null;

				teasers?.forEach((teaser) => {
					const {
						effects: { parameters },
					} = teaser;
					parameters.forEach((parameter) => {
						const { name, value } = parameter;
						if (name === "PromotionalPriceTableItemsDiscount") {
							discountWithCard = +value;
						}
					});
				});

				if (discountWithCard !== null) {
					const priceWithCard =
						PriceWithoutDiscount - discountWithCard;
					const discountPercentage = Math.round(
						(discountWithCard / PriceWithoutDiscount) * 100
					);
					sellerData = {
						sellerName,
						priceWithCard,
						PriceWithoutDiscount,
						discountPercentage,
					};
					break;
				}
			}

			if (sellerData !== null) {
				const data = {
					name,
					brandName,
					image,
					lowPrice,
					...sellerData,
				};
				productsPromo.push(data);
			}
		});
		setExitoPage(productsPromo);
	};

	const getInmuebles = async () => {
		setIsLoading(true);

		setError(null);
		try {
			const response = await generalService.getInmuebles();
			setInmuebles(response);
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const deleteInmuebles = async () => {
		setIsLoading(true);
		setError(null);
		try {
			await generalService.deleteInmuebles();
			setInmuebles([]);
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setPageUrl(e.target.value);
	};

	useEffect(() => {
		getInmuebles();
	}, []);

	return (
		<main className="flex flex-col gap-3 items-center justify-center min-h-screen p-10">
			<div className="flex flex-row items-center justify-center gap-10 w-full">
				<Select
					label="Selecciona un link para scrapear"
					size="sm"
					className="max-w-xs"
					isDisabled={isLoading}
					items={links}
					onChange={handleSelectionChange}
					disallowEmptySelection
				>
					{(page) => (
						<SelectItem key={page.value} value={page.value}>
							{page.label}
						</SelectItem>
					)}
				</Select>
				<Button
					disabled={isLoading}
					onClick={scrapePages}
					color="success"
				>
					Scrappear
				</Button>
				<Button
					disabled={isLoading}
					onClick={getInmuebles}
					color="secondary"
				>
					Recargar tabla
				</Button>
				<Button
					disabled={isLoading}
					onClick={deleteInmuebles}
					color="danger"
				>
					Borrar datos
				</Button>
			</div>

			{isLoading && (
				<Lottie animationData={loadingAnimation} loop={true} />
			)}

			{error && (
				<div className="flex flex-col items-center w-1/2">
					<Lottie
						animationData={errorAnimation}
						draggable
						loop={false}
						style={{ width: 300 }}
					/>
					<pre className="">
						{JSON.stringify(error || null, null, 3)}
					</pre>
				</div>
			)}

			{pageUrl === links[0].value && (
				<div className="!max-w-1/2">
					<CustomTable
						data={exitoPage ?? []}
						columns={columnsExito}
					/>
				</div>
			)}

			{pageUrl === links[1].value && (
				<div className="!max-w-1/2">
					<CustomTable
						data={inmuebles ?? []}
						columns={columnsPitaIbiza}
					/>
				</div>
			)}
		</main>
	);
}
