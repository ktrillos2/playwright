"use client";
import { useCallback, useMemo, useState } from "react";
import { Button, Image, useDisclosure } from "@nextui-org/react";
import { clsx } from "clsx";

import {
  Columns,
  CalculatedCoupon,
  Coupon,
  Commerce,
  Category,
} from "@/interfaces";
import {
  AsyncCustomTable,
  CopyClipboardButton,
  ModalImage,
} from "@/components/ui/buttons";
import { formatToMoney } from "@/helpers";
import Link from "next/link";
import { SelectCategory, SelectCommerce } from ".";

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

export const CouponsTable: React.FC<Props> = ({
  coupons,
  page,
  totalPages,
  totalInmuebles,
  limit,
  commerces,
  categories,
}) => {
  const [selectedInfo, setSelectedInfo] = useState<CalculatedCoupon | null>(
    null
  );

  const [selectedCommerces, setSelectedCommerces] = useState<any>(new Set([]));
  const [selectedCategories, setSelectedCategory] = useState<any>(new Set([]));

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const renderCell = useCallback(
    (data: any, columnKey: React.Key) => {
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
    },
    [onOpen]
  );

  const extraTopContent = (
    // useMemo(  () => (
    <div className="flex w-full gap-4 pr-4">
      {commerces ? (
        <SelectCommerce
          commerces={commerces}
          defaultSelectedKeys={selectedCommerces}
          onChange={setSelectedCommerces}
          valueKey="slug"
          className=""
          selectionMode="multiple"
          variant="flat"
          label={""}
          placeholder="Comercios"
        />
      ) : null}
      {categories ? (
        <SelectCategory
          categories={categories}
          label={"Categorías"}
          defaultSelectedKeys={selectedCategories}
          onChange={setSelectedCategory}
          selectionMode="multiple"
          className=""
          variant="flat"
        />
      ) : null}
    </div>
  );
  //   ),
  //   [selectedCommerces, selectedCategories]
  // );

  return (
    <>
      <ModalImage
        isOpen={isOpen}
        info={selectedInfo!}
        onOpenChange={onOpenChange}
      />
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
    </>
  );
};
