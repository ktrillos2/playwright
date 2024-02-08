import {
	Button,
	Image,
	Pagination,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import { useCallback, type FC } from "react";
import { usePropsPaginator } from "../hooks";
import { Columns } from "../interfaces";

interface Props {
	data: any[];
	columns: Columns[];
}

export const CustomTable: FC<Props> = ({ data, columns }) => {
	const { items, page, pagesPaginator, setPage } = usePropsPaginator({
		data,
	});

	const renderCell = useCallback((data: any, columnKey: React.Key) => {
		const cellValue = data[columnKey as keyof any];
		const { imageFromHeader, url } = data;

		switch (columnKey) {
			case "imageFromHeader":
				return imageFromHeader ? (
					<Image
						src={imageFromHeader}
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
	}, []);

	return (
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
						page={page}
						total={pagesPaginator}
						onChange={(page) => setPage(page)}
					/>
				</div>
			}
		>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn key={column.key}>{column.label}</TableColumn>
				)}
			</TableHeader>
			<TableBody
				emptyContent={"No hay inmuebles para mostrar"}
				items={items}
			>
				{(item: any) => (
					<TableRow key={item.titleSection}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
