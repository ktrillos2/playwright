// Archivo: page.tsx
"use client";
import {
	Button,
	Input,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Image,
	Pagination,
	Select,
	SelectItem,
	Selection,
} from "@nextui-org/react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

import Lottie from "lottie-react";

import loadingAnimation from "../public/lottie/loading.json";
import errorAnimation from "../public/lottie/error.json";
import { generalService } from "./service";
import { Columns, Exito, Inmueble, Pages } from "./interfaces";
import { useRouter } from "next/navigation";
import { CustomTable } from "./components";
import { links } from "./constants";

// const columns: Columns[] = [
// 	{
// 		key: "page",
// 		label: "Inmobiliaria",
// 	},
// 	{
// 		key: "name",
// 		label: "Nombre",
// 	},
// 	{
// 		key: "location",
// 		label: "Ubicación",
// 	},
// 	{
// 		key: "price",
// 		label: "Precio",
// 	},
// 	{
// 		key: "image",
// 		label: "Imagen",
// 	},
// 	{
// 		key: "url",
// 		label: "Detalles",
// 	},
// ];

const columns: Columns[] = [
	{
		key: "imageFromHeader",
		label: "Imagen Header",
	},
	{
		key: "linkImageHeader",
		label: "Link imagen header",
	},
	{
		key: "titleSection",
		label: "Titulo de la sección",
	},
	{
		key: "viewMoreSection",
		label: "Ver mas",
	},
];

export default function Home() {
	const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
	const [exitoPage, setExitoPage] = useState<Exito[]>([]);
	const [pageUrl, setPageUrl] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | any>(null);

	const scrapePages = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await generalService.scrappingData({
				linkParams: pageUrl,
			});
			console.log(response);
			// setInmuebles(response.data);
			setExitoPage(response.pageData);
		} catch (error: any) {
			console.log(error);
			setError(error);
		} finally {
			setIsLoading(false);
		}
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
				{/* <Input
				className="w-1/6"
				type="text"
				value={inputValue}
				onChange={(event) => setInputValue(event.target.value)}
			/>*/}

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

			{exitoPage && (
				<div className="!max-w-1/2">
					<CustomTable data={exitoPage} columns={columns} />
				</div>
			)}
		</main>
	);
}
