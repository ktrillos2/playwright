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
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import Lottie from "lottie-react";

import loadingAnimation from "../public/lottie/loading.json";
import errorAnimation from "../public/lottie/error.json";
import { generalService } from "./service";
import { Columns, Inmueble, Pages } from "./interfaces";
import { useRouter } from "next/navigation";
import { CustomTable } from "./components";

const columns:Columns[] = [
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

export default function Home() {
	const [inputValue, setInputValue] = useState("");
	const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
	const [pages, setpages] = useState<Pages[]>([
		{ label: "Éxito", value: "exito.com" },
		{ label: "Inmobiliaria pita Ibiza", value: "https://pitaibizainmobiliaria.com.co/inmuebles/" },
	]);


	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | any>(null);

	const scrapePages = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await generalService.scrappingData({
				searchParams: inputValue,
			});
			console.log(response);
			setInmuebles(response.data);
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

	useEffect(() => {
		getInmuebles();
	}, []);

	

	return (
		<main className="flex flex-col gap-3 items-center justify-center !max-h-screen">
			<div className="flex flex-row items-center justify-center gap-10 my-5">
				{/* <Input
				className="w-1/6"
				type="text"
				value={inputValue}
				onChange={(event) => setInputValue(event.target.value)}
			/>*/}

				<div className="flex gap-4">
					{/* <Select label="Select an animal" className="max-w-xs">
						{animals.map((animal) => (
							<SelectItem key={animal.value} value={animal.value}>
								{animal.label}
							</SelectItem>
						))}
					</Select> */}
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

{inmuebles && (
  <div className="!max-w-1/2">
    <CustomTable data={inmuebles} columns={columns} />
  </div>
)}
		</main>
	);
}
