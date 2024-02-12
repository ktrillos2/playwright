'use client';
import { useCallback } from "react";
import { Button, Image } from "@nextui-org/react";

import { CustomTable } from "@/components";
import { Columns, Inmueble } from "@/interfaces";

const columns: Columns[] = [
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

interface Props {
  inmuebles: Inmueble[];
}

export const InmueblesTable: React.FC<Props> = ({ inmuebles }) => {
  const renderCell = useCallback((data: any, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof any];
    const { image, url } = data;
    switch (columnKey) {
      case "image":
        return image ? (
          <Image src={image} alt="image" width={100}></Image>
        ) : null;

      case "url":
        return (
          <Button onClick={() => window.open(url, "_blank")}>Ver más</Button>
        );

      default:
        return cellValue;
    }
  }, []);

  return (
    <CustomTable
      data={inmuebles ?? []}
      columns={columns}
      renderCell={renderCell}
    />
  );
};
