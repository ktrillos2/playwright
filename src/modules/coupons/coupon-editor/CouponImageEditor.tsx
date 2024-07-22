"use client";
import React, { useEffect, useRef, useState } from "react";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
  getCurrentImgDataFunction,
} from "react-filerobot-image-editor";
import Lottie from "lottie-react";
import clsx from "clsx";

import { Coupon, CouponLayout } from "@/interfaces";

import loadingImage from "../../../../public/lottie/loading-image.json";
import loadingEditor from "../../../../public/lottie/loading-editor.json";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { CookiesKeys, Info } from "@/enums";
import { kumoneraService } from "@/service/cloud.service";

import Cookies from "js-cookie";
import { convertBase64ToFile } from "@/helpers";
import { saveCouponDetail } from "@/actions/coupon-details/coupon-detail.actions";
import toast from "react-hot-toast";

interface Props {
  coupon: Coupon;
  selectedLayout: CouponLayout;
  clearSelection: () => void;
  transparentIsLoading: boolean;
  displayImage: string;
}

export const CouponImageEditor: React.FC<Props> = ({
  coupon,
  selectedLayout,
  clearSelection,
  transparentIsLoading,
  displayImage,
}) => {
  const editedImage = useRef<getCurrentImgDataFunction>();

  const [currentLayout, setCurrentLayout] =
    useState<CouponLayout>(selectedLayout);

  const { images, name, commerce } = coupon;

  const imageName = `${commerce.name}-${name
    .replaceAll(`"`, "")
    .split(" ")
    .slice(0, 5)
    .join("-")}`.toLowerCase();

  const [sizeIsLoading, setSizeIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLayout({
        ...currentLayout,
        size: { width: "100%", height: "calc(100vh - 120px)" },
      });
      setSizeIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);



  const getJsonBlobImage = () => {
    const annotations = editedImage.current?.({})?.designState?.annotations;

    const jsonBlob = new Blob([JSON.stringify(annotations)], {
      type: "application/json",
    });

    return jsonBlob;
  }

  const getLayoutImage = () => {
    const jsonBlob = getJsonBlobImage();

    const link = document.createElement("a");
    link.download = "plantilla";
    link.href = URL.createObjectURL(jsonBlob);
    link.click();

    URL.revokeObjectURL(link.href);
  };

  const createCouponOnAdmin = async () => {
    try {
      const imgBase64 = editedImage.current?.({}).imageData.imageBase64;

      const couponDetail = await saveCouponDetail(imgBase64, coupon._id)

      window.open(`${Info.KUMONERA_ADMIN}/platform/external-companies/create-coupon?scraper=${couponDetail._id}`, '_blank', 'noopener,noreferrer');
      window.open(coupon.url, '_blank',);

      toast.success("Redireccionando a Admin")

    } catch (error) {
      toast.error("Ha ocurrido un error")
    }

  }

  return (
    <div className="relative w-full">
      <div className="z-50">
        {sizeIsLoading ? (
          <div className="absolute w-full grid place-content-center h-full -mt-4">
            <Lottie animationData={loadingEditor} loop={true} />
            <span className="text-base md:text-lg text-center -mt-16">
              Cargando el editor de cupones
            </span>
          </div>
        ) : null}
        <div className="grid justify-end gap-2 mb-2">
          <div className="flex justify-end  gap-2 items-center">
            <Button
              isDisabled={sizeIsLoading}
              onClick={clearSelection}
              size="sm"
              variant="flat"
              color="danger"
            >
              Seleccionar otra plantilla
            </Button>
            <Button
              isDisabled={sizeIsLoading}
              onClick={getLayoutImage}
              size="sm"
              variant="flat"
              color="success"
            >
              Guardar Plantilla
            </Button>
            <Button
              isDisabled={sizeIsLoading}
              onClick={createCouponOnAdmin}
              size="sm"
              variant="flat"
              color="primary"
            >
              Crear cupón
            </Button>
          </div>
          <small className="md:hidden">
            Recomendamos usar un computador para una mejor experiencia.
          </small>
        </div>
      </div>
      <div
        style={currentLayout.size}
        className={clsx("overflow-hidden z-0 relative", {
          "opacity-0": sizeIsLoading,
          "pointer-events-none opacity-50":
            !sizeIsLoading && transparentIsLoading,
        })}
      >
        <FilerobotImageEditor
          theme={{
            palette: {
              'bg-secondary': '#000',
              'bg-primary': '#f2f',
              'accent-primary': '#000',
              'accent-primary-active': '#000',
              'icons-primary': '#000',
              'icons-secondary': '#000',
              'borders-secondary': '#000',
              'borders-primary': '#000',
              'borders-strong': '#000',
              'light-shadow': '#000',
              'warning': '#000',
              'btn-primary-text': '#f2f',
              'btn-disabled-text': '#000',
              'btn-secondary-text': '#000',
              'active-secondary-hover': '#000',
              'btn-primary-bg': '#000',
              'bg-btn-primary': '#000',
              'btn-save': '#000',
              'btn-save-bg': '#000',
              'bg-btn-save': '#000',
              'bg-btn': '#000',
              'btn-bg': '#000',
              'success': '#000',
              'violet': '#000',
              'indigo': '#000',
              'salad': '#000',
              'bg-primary-hover': '#000',
              'bg-primary-active': '#000',
              'bg-hover': '#000',
            }
          }}

          language="es"
          source={"default-coupon-bg.png"}
          onSave={(editedImageObject, designState) => {
            const link = document.createElement("a");
            link.download = `${name.toLowerCase().split(" ").join("-")}.png`;
            link.href = editedImageObject.imageBase64 as any;
            link.click();
          }}
          annotationsCommon={{
            fill: "#000000",
          }}
          getCurrentImgDataFnRef={editedImage}
          Text={{ text: "Escribe aquí tu contenido..." }}
          tabsIds={[TABS.ANNOTATE, TABS.FILTERS, TABS.FINETUNE]}
          defaultTabId={TABS.ANNOTATE}
          defaultToolId={TOOLS.TEXT}
          savingPixelRatio={0}
          previewPixelRatio={0}
          defaultSavedImageName={imageName}
          // @ts-ignore
          loadableDesignState={{
            annotations: currentLayout.layout({
              coupon,
              displayImage: displayImage || images[0],
            }),
          }}

        />
      </div>

      {!sizeIsLoading && transparentIsLoading ? (
        <div className="-top-5 absolute w-full grid place-content-center h-full">
          <Lottie
            animationData={loadingImage}
            loop={true}
            className="w-64 h-64"
          />
          <span className="text-base md:text-lg text-center -mt-16">
            Eliminando el fondo de la imagen
          </span>
        </div>
      ) : null}

      {/* <pre>{JSON.stringify(uploadedDesignState?.annotations, null, 3)}</pre> */}
    </div>
  );
};
