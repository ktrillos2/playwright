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
	Image
} from "@nextui-org/react";
import { useState } from "react";

interface Inmuebles {
	h4: string;
	p: string;
	span: string;
	bgImage: string;
}

export default function Home() {
	const [inputValue, setInputValue] = useState("");
	const [inmuebles, setInmuebles] = useState<Inmuebles[]>();

	const getInfo = async () => {
		const response = await fetch("/api", {
			method: "POST",
			body: JSON.stringify({ searchParams: inputValue }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		setInmuebles(data.data);
		console.log(data);
		console.log(data.data, "datadataaaa");
	};

	return (
		<main className="flex flex-col gap-3 items-center justify-center !max-h-screen">
			<div className="flex flex-row items-center justify-center gap-10 my-5">
			{/* <Input
				className="w-1/6"
				type="text"
				value={inputValue}
				onChange={(event) => setInputValue(event.target.value)}
			/>*/}
			<Button onClick={getInfo}>Scrappear</Button> 
			</div>
			{inmuebles && (
				<div className="!max-w-1/2 !max-h-[600px]">
					<Table isHeaderSticky aria-label="Example static collection table">
						<TableHeader>
							<TableColumn>Nombre</TableColumn>
							<TableColumn>Ubicación</TableColumn>
							<TableColumn>Precio</TableColumn>
							<TableColumn>Imagen</TableColumn>
						</TableHeader>
						<TableBody>
							{inmuebles.map((item, index) => (
								<TableRow key={index}>
									<TableCell>{item.h4}</TableCell>
									<TableCell>{item.p}</TableCell>
									<TableCell>{item.span}</TableCell>
									<TableCell><Image src={item.bgImage} alt="imagen inmueble" width={100}></Image></TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</main>
	);
}
