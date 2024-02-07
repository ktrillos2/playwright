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
} from "@nextui-org/react";
import { useState } from "react";

interface Inmuebles {
	h4: string;
	p: string;
	span: string;
	bgImage: string;
	code: string;
}

import Lottie from "lottie-react";

import loadingAnimation from "../public/lottie/loading.json";
import errorAnimation from "../public/lottie/error.json";
import { motion } from "framer-motion";

export default function Home() {
	const [inputValue, setInputValue] = useState("");
	const [inmuebles, setInmuebles] = useState<Inmuebles[]>();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | any>(null);

	const getInfo = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch("/api", {
				method: "POST",
				body: JSON.stringify({ searchParams: inputValue }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			setInmuebles(data.data);
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	};

	console.log({ error });

	return (
		<main className="flex flex-col gap-3 items-center justify-center !max-h-screen">
			<div className="flex flex-row items-center justify-center gap-10 my-5">
				{/* <Input
				className="w-1/6"
				type="text"
				value={inputValue}
				onChange={(event) => setInputValue(event.target.value)}
			/>*/}

				<motion.div drag>
					<Button disabled={isLoading} onClick={getInfo}>
						Scrappear
					</Button>
				</motion.div>
			</div>

			{isLoading && (
				<Lottie animationData={loadingAnimation} loop={true} />
			)}

			{error && (
				<motion.div className="" drag>
					<Lottie
						animationData={errorAnimation}
						draggable
						loop={true}
					/>
					<pre className="text-center">
						{JSON.stringify(error || null)}
					</pre>
				</motion.div>
			)}

			{inmuebles && (
				<motion.div className="!max-w-1/2 !max-h-[600px]" drag>
					<Table
						isHeaderSticky
						className="max-h-10"
						aria-label="Example static collection table"
					>
						<TableHeader>
							<TableColumn>Indice</TableColumn>
							<TableColumn>Nombre</TableColumn>
							<TableColumn>Ubicación</TableColumn>
							<TableColumn>Precio</TableColumn>
							<TableColumn>Imagen</TableColumn>
							<TableColumn>Codigo</TableColumn>
						</TableHeader>
						<TableBody>
							{inmuebles.map((item, index) => (
								<TableRow key={index}>
									<TableCell>{index}</TableCell>
									<TableCell>{item.h4}</TableCell>
									<TableCell>{item.p}</TableCell>
									<TableCell>{item.span}</TableCell>
									<TableCell>
										<Image
											src={item.bgImage}
											alt="imagen inmueble"
											width={100}
										></Image>
									</TableCell>
									<TableCell>{item.code}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</motion.div>
			)}
		</main>
	);
}
