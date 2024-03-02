"use client";
import { useMemo } from "react";

import {
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";

import { Columns } from "../../interfaces";
import { useCustomSearchParams } from "@/hooks";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 100];

const ROWS_PER_PAGE_OPTIONS_SELECT = ROWS_PER_PAGE_OPTIONS.map((option) => ({
  label: "" + option,
  value: "" + option,
}));

interface Props {
  items: any[];
  columns: Columns[];
  renderCell?: (...props: any) => any;
  page: number;
  totalPages: number;
  totalItems: number;
  itemsName?: string;
  limit: number;
  extraTopContent?: JSX.Element;
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
  extraTopContent,
}) => {
  const { setQueries } = useCustomSearchParams();

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = e.target.value;
    setQueries({ page: 1, limit: newLimit });
  };

  const onPageChange = (page: number) => {
    setQueries({ page });
  };

  const selectedKeys = new Set(["" + limit]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 pt-3">
        <div className="flex justify-between items-center">
          {extraTopContent ?? (
            <span className="text-default-400 text-small">
              Total: {totalItems} {itemsName}
            </span>
          )}

          <Select
            onChange={onRowsPerPageChange}
            label="# Filas"
            items={ROWS_PER_PAGE_OPTIONS_SELECT}
            defaultSelectedKeys={selectedKeys}
            className="w-24"
          >
            {(option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            )}
          </Select>
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
