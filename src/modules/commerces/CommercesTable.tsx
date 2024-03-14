"use client";

import { useCallback } from "react";

import {
  Button,
  Divider,
  Image,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";

import { TbWorldShare } from "react-icons/tb";
import { MdArrowOutward } from "react-icons/md";
import { LuPencil } from "react-icons/lu";

import { CustomTable } from "@/components";
import { Columns, Commerce } from "@/interfaces";

const columns: Columns[] = [
  {
    key: "image",
    label: "Logo",
  },
  {
    key: "name",
    label: "Nombre",
  },
  {
    key: "categories",
    label: "Categorías",
  },
  {
    key: "queries",
    label: "Queries de búsqueda",
  },
  {
    key: "url",
    label: "Acciones",
  },
];

interface Props {
  commerces: Commerce[];
}

export const CommercesTable: React.FC<Props> = ({ commerces }) => {
  const renderCell = useCallback(
    (data: Commerce, columnKey: keyof Commerce) => {
      const cellValue = data[columnKey];
      const { image, url, categories, slug } = data;

      if (columnKey === "image") {
        return <Image src={image} alt="image" className="!w-[90px]" />;
      }

      if (columnKey === "url") {
        return (
          <div className="flex justify-center gap-2">
            <Button
              as={Link}
              href={`/commerces/edit/${slug}`}
              color="primary"
              isIconOnly
            >
              <LuPencil size={20} />
            </Button>
            <Button
              as={Link}
              href={url}
              target="_blank"
              isIconOnly
              color="secondary"
            >
              <TbWorldShare size={20} />
            </Button>
          </div>
        );
      }

      if (columnKey === "categories") {
        return (
          <Popover placement="bottom" showArrow={true} backdrop="opaque">
            <PopoverTrigger>
              <Button>{categories.length}</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2 flex flex-col gap-1">
                <div className="text-lg font-bold text-center">Categorías</div>
                <Divider />
                {categories.map(({ category: { name }, path }) => (
                  <div
                    key={path}
                    className="grid grid-cols-2 justify-between gap-2 items-center"
                  >
                    <span className="text-semibold">{name}:</span>
                    <Link
                      href={`${url}/${path}`}
                      target="_blank"
                      className="text-tiny underline"
                    >
                      {path} <TbWorldShare />
                    </Link>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      }

      return cellValue;
    },
    []
  );

  return (
    <CustomTable
      columns={columns}
      items={commerces}
      itemsName="comercios"
      renderCell={renderCell}
    />
  );
};
