"use client";
import React, { useEffect, useRef, useState } from "react";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
  getCurrentImgDataFunction,
} from "react-filerobot-image-editor";
import Lottie from "lottie-react";
import clsx from "clsx";

import { useToTransparentImage } from "@/hooks";
import { couponLayout1, couponLayout2 } from "@/helpers";
import { Coupon } from "@/interfaces";

import loadingImage from "../../../../public/lottie/loading-image.json";
import loadingEditor from "../../../../public/lottie/loading-editor.json";
import { Button } from "@nextui-org/react";

interface Layout {
  name: string;
  layout: (props: any) => any;
  size: { width: string; height: string };
  image: string;
}

const LAYOUTS = [
  {
    name: "Plantilla 1",
    layout: couponLayout1,
    size: { width: "993px", height: "550px" },
    image: "/coupons/layouts/layout-1.png",
  },
  {
    name: "Plantilla 2",
    layout: couponLayout2,
    size: { width: "993px", height: "550px" },
    image: "/coupons/layouts/layout-2.png",
  },
];

interface Props {
  coupon: Coupon;
  selectedLayout: Layout;
  clearSelection: () => void;
}

export const CouponImageEditor: React.FC<Props> = ({
  coupon,
  selectedLayout,
  clearSelection,
}) => {
  const editedImage = useRef<getCurrentImgDataFunction>();

  const [currentLayout, setCurrentLayout] = useState<Layout>(selectedLayout);

  const { images, name, commerce } = coupon;

  const imageName = `${commerce.name}-${name
    .replaceAll(`"`, "")
    .split(" ")
    .slice(0, 5)
    .join("-")}`.toLowerCase();

  const { displayImage, isLoading: transparentIsLoading } =
    useToTransparentImage(images[0]);

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

  const getLayoutImage = () => {
    const annotations = editedImage.current?.({})?.designState?.annotations;

    const jsonBlob = new Blob([JSON.stringify(annotations)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.download = "plantilla";
    link.href = URL.createObjectURL(jsonBlob);
    link.click();

    URL.revokeObjectURL(link.href);
  };

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
          theme={{}}
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
