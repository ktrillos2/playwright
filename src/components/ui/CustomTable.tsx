"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableProps,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";

import { Columns } from "@/interfaces";

interface Props extends TableProps {
  items: any[];
  columns: Columns[];
  renderCell?: (...props: any) => any;
  itemsName?: string;
}

export const CustomTable: React.FC<Props> = ({
  items,
  columns,
  renderCell = getKeyValue,
  itemsName = "items",
}) => {
  return (
    <Table
      className="h-full overflow-hidden"
      aria-label={`Una tabla de ${itemsName}`}
      topContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn className="text-center" key={column.key}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={`No hay ${itemsName} para mostrar`}
        items={items}
      >
        {(item: any) => (
          <TableRow className="text-center" key={item._id ?? item.name}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
