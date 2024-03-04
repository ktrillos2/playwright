"use client";
import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button, Image, Selection, useDisclosure } from "@nextui-org/react";
import { clsx } from "clsx";
import { useDebounceCallback } from "usehooks-ts";

import { Columns, Coupon, Commerce, Category } from "@/interfaces";
import { AsyncCustomTable, CopyClipboardButton } from "@/components/ui/buttons";
import { formatToMoney } from "@/helpers";
import Link from "next/link";
import { SelectCategory, SelectCommerce } from ".";
import { useCustomSearchParams } from "@/hooks";

const columns: Columns[] = [
  {
    key: "commerce",
    label: "Comercio",
  },
  {
    key: "name",
    label: "Nombre",
  },
  {
    key: "image",
    label: "Imagen",
  },
  {
    key: "discountPercentage",
    label: "Descuento",
  },
  {
    key: "lowPrice",
    label: "Precio con descuento",
  },
  {
    key: "discountWithCard",
    label: "Precio con tarjeta",
  },
  {
    key: "priceWithoutDiscount",
    label: "Precio sin descuento",
  },
  {
    key: "category",
    label: "Categoría",
  },
  { key: "url", label: "Link" },
  {
    key: "options",
    label: "Opciones",
  },
];

interface Props {
  coupons: Coupon[];
  page: number;
  totalPages: number;
  totalInmuebles: number;
  limit: number;
  commerces?: Commerce[];
  categories?: Category[];
}

interface Queries {
  limit: number;
  page: number;
  commerces: string[];
  categories: string[];
}

export const CouponsTable: React.FC<Props> = ({
  coupons,
  page,
  totalPages,
  totalInmuebles,
  limit,
  commerces,
  categories,
}) => {
  const { setQueries, getQueries } = useCustomSearchParams();

  const { categories: selectedCategories, commerces: selectedCommerces } =
    getQueries<Queries>({
      select: ["categories", "commerces"],
      transformToArray: ["categories", "commerces"],
    });

  const renderCell = useCallback((data: any, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof any];
    const { images, image, url, _id } = data;

    if (columnKey === "image") {
      return images ? (
        <div className="w-[80px]">
          <Image src={images[0]} alt="image" className="!w-full"></Image>
        </div>
      ) : (
        <Image src={image} alt="image" className="!w-[90px]"></Image>
      );
    }

    if (columnKey === "url") {
      return (
        <div className="flex gap-2">
          <Button onClick={() => window.open(url, "_blank")}>Ver más</Button>
          <CopyClipboardButton content={url} />
        </div>
      );
    }

    if (columnKey === "discountPercentage") {
      return (
        <span
          className={clsx({
            "text-success-500": cellValue >= 50,
          })}
        >
          {cellValue} %
        </span>
      );
    }

    if (["commerce", "category"].includes(columnKey as any))
      return cellValue.name;

    if (
      ["lowPrice", "discountWithCard", "priceWithoutDiscount"].includes(
        columnKey as string
      )
    ) {
      return formatToMoney(cellValue);
    }

    if (columnKey === "options") {
      return (
        <Button as={Link} href={`/coupons/${_id}`}>
          Ver cupón
        </Button>
      );
    }

    return cellValue;
  }, []);

  const extraTopContent = (
    // useMemo(  () => (
    <div className="flex w-full gap-4 pr-4">
      {commerces ? (
        <SelectCommerce
          aria-label="SelectCommerce"
          commerces={commerces}
          onChange={({ target: { value: commerces } }) =>
            setQueries({ commerces, page: 1 })
          }
          defaultSelectedKeys={new Set(selectedCommerces)}
          selectionMode="multiple"
          variant="flat"
          valueKey="slug"
          label={""}
          placeholder="Comercios"
        />
      ) : null}
      {categories ? (
        <SelectCategory
          aria-label="SelectCategory"
          categories={categories}
          label={"Categorías"}
          defaultSelectedKeys={new Set(selectedCategories)}
          onChange={({ target: { value: categories } }) =>
            setQueries({ categories, page: 1 })
          }
          selectionMode="multiple"
          valueKey="slug"
          variant="flat"
        />
      ) : null}
    </div>
  );
  //   ),
  //   [selectedCommerces, selectedCategories]
  // );

  return (
    <AsyncCustomTable
      items={coupons ?? []}
      columns={columns}
      renderCell={renderCell}
      page={page}
      totalPages={totalPages}
      totalItems={totalInmuebles}
      limit={limit}
      itemsName="cupones"
      extraTopContent={extraTopContent}
    />
  );
};
