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
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import Lottie from "lottie-react";

import loadingAnimation from "../public/lottie/loading.json";
import errorAnimation from "../public/lottie/error.json";
import { generalService } from "./service";
import { Inmueble } from "./interfaces";
import { useRouter } from "next/navigation";

const columns = [
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

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | any>(null);

	const [page, setPage] = useState(1);
	const rowsPerPage = 5;

	const pages = Math.ceil(inmuebles.length / rowsPerPage) || 1;

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return inmuebles.slice(start, end);
	}, [page, inmuebles]);

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

	const renderCell = useCallback(
		(inmueble: Inmueble, columnKey: React.Key) => {
			const cellValue = inmueble[columnKey as keyof Inmueble];
			const { image, url } = inmueble;

			switch (columnKey) {
				case "image":
					return image ? (
						<Image
							src={image}
							alt="imagen inmueble"
							width={100}
						></Image>
					) : null;

				case "url":
					return (
						<Button onClick={() => window.open(url, "_blank")}>
							Ver más
						</Button>
					);

				default:
					return cellValue;
			}
		},
		[]
	);

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
					<Table
						className="h-full"
						aria-label="Example table with client side pagination"
						bottomContent={
							<div className="flex w-full justify-center">
								<Pagination
									isCompact
									showControls
									showShadow
									color="secondary"
									page={1}
									total={pages}
									onChange={(page) => setPage(page)}
								/>
							</div>
						}
					>
						<TableHeader columns={columns}>
							{(column) => (
								<TableColumn key={column.key}>
									{column.label}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody
							emptyContent={"No hay inmuebles para mostrar"}
							items={items}
						>
							{(item) => (
								<TableRow key={item.url}>
									{(columnKey) => (
										<TableCell>
											{renderCell(item, columnKey)}
										</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}
		</main>
	);
}
