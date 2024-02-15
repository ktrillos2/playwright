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
import { Columns, Exito, Inmueble } from "../interfaces";
import { CopyClipboardButton, CustomTable, ModalImage } from "../components";
import { links } from "../constants";

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
  { key: "urlExito", label: "Link" },
  {
    key: "options",
    label: "Opciones",
  },
];

export default function Home() {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>();
  const [exitoPage, setExitoPage] = useState<Exito[]>();
  const [pageUrl, setPageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | any>(null);

  const scrapePages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (pageUrl === links[0].value) {
        setDataExito();
      } else {
        setDataPitaIbiza();
      }
    } catch (error: any) {
      setError(error);
    } finally {
      if (!(pageUrl === links[0].value)) {
        setIsLoading(false);
      }
    }
  };

  const setDataPitaIbiza = async () => {
    const response = await generalService.scrappingData({
      linkParams: pageUrl,
      page: "Pita Ibiza",
    });
    setInmuebles(response.data);
  };

  const setDataExito = async () => {
    setIsLoading(true);
    try {
      setError(null);
      const response: any = await generalService.scrappingData({
        linkParams: pageUrl,
        page: "Exito",
      });
      const { data } = response;
      setExitoPage(data);
    } catch (error: any) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  const getInmuebles = async () => {
    setIsLoading(true);

    setError(null);
    try {
      const response = await generalService.getInmuebles({ limit: 1000 });
      setInmuebles(response.docs);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
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
    getInmuebles();
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedInfo, setSelectedInfo] = useState<Exito | null>(null);

  const renderCellExito = useCallback(
    (data: any, columnKey: React.Key) => {
      const cellValue = data[columnKey as keyof any];
      const { images, image, urlExito } = data;
      switch (columnKey) {
        case "image":
          return images ? (
            <div className="w-[80px]">
              <Image src={images[0]} alt="image" className="!w-full"></Image>
            </div>
          ) : (
            <Image src={image} alt="image" className="!w-[90px]"></Image>
          );

        case "urlExito":
          return (
            <div className="flex gap-2">
              <Button onClick={() => window.open(urlExito, "_blank")}>
                Ver más
              </Button>
              <CopyClipboardButton content={urlExito} />
            </div>
          );

        case "options":
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

        default:
          return cellValue;
      }
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
