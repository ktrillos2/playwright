// Archivo: page.tsx
"use client";
import {
  Button,
  Image,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

import Lottie from "lottie-react";

import loadingAnimation from "../../public/lottie/loading.json";
import errorAnimation from "../../public/lottie/error.json";

import { generalService } from "../service";
import { Columns, Coupon, CalculatedCoupon, Inmueble } from "../interfaces";
import { CopyClipboardButton, CustomTable, ModalImage } from "../components";
import { links } from "../constants";
import { formatCalculatedCoupon, formatToMoney } from "@/helpers";
import { clsx } from "clsx";

const columnsPitaIbiza: Columns[] = [
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

const columnsExito: Columns[] = [
  {
    key: "name",
    label: "Nombre",
  },
  {
    key: "brandName",
    label: "Marca",
  },
  {
    key: "image",
    label: "Imagen",
  },
  {
    key: "lowPrice",
    label: "Precio con descuento",
  },
  {
    key: "discountPercentage",
    label: "Descuento",
  },
  {
    key: "priceWithCard",
    label: "Precio con tarjeta",
  },
  {
    key: "priceWithoutDiscount",
    label: "Precio sin descuento",
  },
  { key: "url", label: "Link" },
  {
    key: "options",
    label: "Opciones",
  },
];

export default function Home() {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>();
  const [exitoPage, setExitoPage] = useState<CalculatedCoupon[]>();
  const [pageUrl, setPageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | any>(null);

  const scrapePages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (pageUrl === links[0].value) {
       await scrapeDataExito();
      } else {
        await  scrapeDataPitaIbiza();
      }
    } catch (error: any) {
      setError(error);
    } finally {
      if (!(pageUrl === links[0].value)) {
        setIsLoading(false);
      }
    }
  };

  const scrapeDataPitaIbiza = async () => {
    try {
      const response = await generalService.scrappingData({
        linkParams: pageUrl,
        page: "Pita Ibiza",
      });
      setInmuebles(response.data);
    } catch (error) {
      throw error
    }
   
  };

  const scrapeDataExito = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await generalService.scrappingData({
        linkParams: pageUrl,
        page: "Exito",
      });
      const data: Coupon[] = response.data;

      const formattedData = formatCalculatedCoupon(data);

      setExitoPage(formattedData);
    } catch (error: any) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  const getInmuebles = async () => {
    try {
      const response = await generalService.getInmuebles({ limit: 1000 });
      setInmuebles(response.docs);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const getCoupons = async () => {
    try {
      const response = await generalService.getCoupons({ limit: 1000 });

      const { docs } = response;

      const formattedData = formatCalculatedCoupon(docs);

      setExitoPage(formattedData);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const getData = async () => {
    try {
      await Promise.all([getInmuebles(), getCoupons()]);
    } catch (error) {
      setError(error);
    }
  };

  const deleteInmuebles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await generalService.deleteInmuebles();
      setInmuebles([]);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageUrl(e.target.value);
  };

  useEffect(() => {
    getData();
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedInfo, setSelectedInfo] = useState<CalculatedCoupon | null>(
    null
  );

  const renderCellExito = useCallback(
    (data: any, columnKey: React.Key) => {
      const cellValue = data[columnKey as keyof any];
      const { images, image, url } = data;

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

      if (
        ["lowPrice", "priceWithCard", "priceWithoutDiscount"].includes(
          columnKey as string
        )
      ) {
        return formatToMoney(cellValue);
      }

      if (columnKey === "options") {
        return (
          <Button
            onClick={() => {
              onOpen();
              setSelectedInfo(data);
            }}
          >
            Ver cupón
          </Button>
        );
      }

      return cellValue;
    },
    [onOpen]
  );

  const renderCellPitiIbiza = useCallback((data: any, columnKey: React.Key) => {
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
    <main className="flex flex-col gap-3 items-center justify-center min-h-screen p-10">
      <ModalImage
        isOpen={isOpen}
        info={selectedInfo!}
        onOpenChange={onOpenChange}
      />

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
        <Select
          label="Selecciona un link para scrapear"
          size="sm"
          className="max-w-xs"
          isDisabled={isLoading}
          items={links}
          onChange={handleSelectionChange}
          disallowEmptySelection
        >
          {(page) => (
            <SelectItem key={page.value} value={page.value}>
              {page.label}
            </SelectItem>
          )}
        </Select>
        <Button disabled={isLoading} onClick={scrapePages} color="success">
          Scrappear
        </Button>
        <Button disabled={isLoading} onClick={getInmuebles} color="secondary">
          Recargar tabla
        </Button>
        <Button disabled={isLoading} onClick={deleteInmuebles} color="danger">
          Borrar datos
        </Button>
      </div>

      {isLoading && <Lottie animationData={loadingAnimation} loop={true} />}

      {error && (
        <div className="flex flex-col items-center w-1/2">
          <Lottie
            animationData={errorAnimation}
            draggable
            loop={false}
            style={{ width: 300 }}
          />
          <pre className="">{JSON.stringify(error || null, null, 3)}</pre>
        </div>
      )}

      {pageUrl === links[0].value && (
        <div className="w-[80vw]">
          <CustomTable
            data={exitoPage ?? []}
            columns={columnsExito}
            renderCell={renderCellExito}
          />
        </div>
      )}

      {pageUrl === links[1].value && (
        <div className="w-[80vw]">
          <CustomTable
            data={inmuebles ?? []}
            columns={columnsPitaIbiza}
            renderCell={renderCellPitiIbiza}
          />
        </div>
      )}
    </main>
  );
}
