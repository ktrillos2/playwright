"use client";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { Columns } from "../../interfaces";
import { useMemo } from "react";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 100];
interface Props {
  items: any[];
  columns: Columns[];
  renderCell?: (...props: any) => any;
  page: number;
  totalPages: number;
  totalItems: number;
  itemsName?: string;
  limit: number;
}

export const AsyncCustomTable: React.FC<Props> = ({
  items,
  columns,
  renderCell = getKeyValue,
  page,
  totalPages,
  totalItems,
  itemsName = "items",
  limit,
}) => {
  const router = useRouter();

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = e.target.value;
    router.replace(`?page=1&limit=${newLimit}`);
  };

  const onPageChange = (page: number) => {
    router.replace(`?page=${page}&limit=${limit}`);
  };


  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3"></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total: {totalItems} {itemsName}
          </span>
          <label
            className="flex items-center text-default-400 text-small"
            htmlFor="rows-per-page"
          >
            Filas por página:
            <select
              id="rows-per-page"
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              value={limit}
            >
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }, [totalItems, itemsName, limit]);

  return (
    <Table
      className="h-full"
      aria-label={`Una tabla de ${itemsName}`}
      topContent={topContent}
      topContentPlacement="outside"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
      }
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
