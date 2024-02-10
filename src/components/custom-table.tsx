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
	getKeyValue,
} from "@nextui-org/react";
import { useCallback, type FC } from "react";
import { usePropsPaginator } from "../hooks";
import { Columns } from "../interfaces";

interface Props {
	data: any[];
	columns: Columns[];
	renderCell?: (...props: any) => any
}

export const CustomTable: FC<Props> = ({ data, columns, renderCell = getKeyValue }) => {
	const { items, page, pagesPaginator, setPage } = usePropsPaginator({
		data,
	});

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
					<TableRow key={item._id??item.name}>
						{(columnKey) => (
							<TableCell>{renderCell(item, columnKey)}</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
