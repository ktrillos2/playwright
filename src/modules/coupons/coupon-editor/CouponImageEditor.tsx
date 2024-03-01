"use client";
import React, { useEffect, useState } from "react";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from "react-filerobot-image-editor";
import Lottie from "lottie-react";
import clsx from "clsx";

import { useToTransparentImage } from "@/hooks";
import { couponLayout } from "@/helpers";
import { Coupon } from "@/interfaces";

import loadingImage from "../../../../public/lottie/loading-image.json";
import loadingEditor from "../../../../public/lottie/loading-editor.json";

interface Props {
  coupon: Coupon;
}

const CouponImageEditor: React.FC<Props> = ({ coupon }) => {
  const { images, name, commerce } = coupon;

  const imageName = `${commerce.name}-${name
    .replaceAll(`"`, "")
    .split(" ")
    .slice(0, 5)
    .join("-")}`.toLowerCase();

  const { displayImage, isLoading: transparentIsLoading } =
    useToTransparentImage(images[0]);
  const [size, setSize] = useState<{ width: string; height: string }>({
    width: "993px",
    height: "550px",
  });

  const [sizeIsLoading, setSizeIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSize({ width: "100%", height: "calc(100vh - 120px)" });
      setSizeIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

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
        {sizeIsLoading ? null : (
          <small className="md:hidden">
           Recomendamos usar un computador para una mejor experiencia.
          </small>
        )}
      </div>
      <div
        style={size}
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
          Text={{ text: "Escribe aquí tu contenido..." }}
          tabsIds={[TABS.ANNOTATE, TABS.FILTERS, TABS.FINETUNE]}
          defaultTabId={TABS.ANNOTATE}
          defaultToolId={TOOLS.TEXT}
          savingPixelRatio={0}
          previewPixelRatio={0}
          defaultSavedImageName={imageName}
          // @ts-ignore
          loadableDesignState={{
            annotations: couponLayout({
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

export default CouponImageEditor;
