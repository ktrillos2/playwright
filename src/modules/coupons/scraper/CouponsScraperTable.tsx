"use client";
import { useRouter } from "next/navigation";
import { generalService } from "@/service";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import Lottie from "lottie-react";

import { Columns, LogCategory, LogType } from "@/interfaces";
import { CouponPages } from "@/enums";

import loadingAnimation from "../../../../public/lottie/loading.json";

const columns: Columns[] = [
  {
    key: "image",
    label: "Imagen",
  },
  {
    key: "label",
    label: "Nombre",
  },
  {
    key: "actions",
    label: "Acciones",
  },
  {
    key: "loading",
    label: "Cargando",
  },
];

const COUPON_PAGES = [
  {
    key: CouponPages.EXITO,
    label: "Exito",
    image: "/page-images/exito-logo.png",
  },
  {
    key: CouponPages.METRO,
    label: "Metro",
    image: "/page-images/metro-logo.png",
  },
];

export const CouponsScraperTable = () => {
  const router = useRouter();

  const [loadingState, setLoadingState] = useState<
    Record<CouponPages, boolean>
  >({
    [CouponPages.EXITO]: false,
    [CouponPages.METRO]: false,
  });

  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    setForceUpdate(!forceUpdate);
  }, [loadingState]);

  const handleScrape = async (page: CouponPages) => {
    setLoadingState((prev) => ({
      ...prev,
      [page]: true,
    }));
    try {
      if (page === CouponPages.EXITO) {
        await generalService.createLogMessage({
          category: LogCategory.COUPON,
          type: LogType.LOADING,
          message: "Scrapeando Exito",
        });
        router.refresh();
        await generalService.scrapeExito();
      }
      if (page === CouponPages.METRO) {
        await generalService.createLogMessage({
          category: LogCategory.COUPON,
          type: LogType.LOADING,
          message: "Scrapeando Metro",
        });
        router.refresh();
        await generalService.scrapeMetro();
      }
      router.refresh();
      // Revalida la data de la página /coupons
    } catch (error) {
      router.refresh();
    } finally {
      setLoadingState((prev) => ({ ...prev, [page]: false }));
    }
  };

  const renderCell = useCallback(
    (data: any, columnKey: React.Key) => {
      const cellValue = data[columnKey as keyof any];

      const { image, key } = data;
      switch (columnKey) {
        case "image":
          return <Image src={image} alt="image" className="!w-[90px]"></Image>;
        case "actions":
          return (
            <Button
              onClick={() => handleScrape(key as CouponPages)}
              disabled={loadingState[key as CouponPages]}
            >
              {loadingState[key as CouponPages] ? "Scrapeando..." : "Scrapear"}
            </Button>
          );
        case "loading":
          return loadingState[key as CouponPages] ? (
            <div className="max-w-48">
              <Lottie
                animationData={loadingAnimation}
                loop={true}
                className="max-w-1/2"
              />
            </div>
          ) : (
            "No se esta cargando"
          );
        default:
          return cellValue;
      }
    },
    [loadingState]
  );

  return (
    <Table
      aria-label="Example table with dynamic content"
      key={forceUpdate.toString()}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody items={COUPON_PAGES}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell className="max-w-[100px]">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
