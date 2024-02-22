"use client";
import React, { useEffect, useState } from "react";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from "react-filerobot-image-editor";
import clsx from "clsx";

import { useToTransparentImage } from "@/hooks";
import { couponLayout } from "@/helpers";
import { Coupon } from "@/interfaces";
interface Props {
  coupon: Coupon;
}

const CouponImageEditor: React.FC<Props> = ({ coupon }) => {
  const { images, name, page } = coupon;

  const imageName = `${page}-${name
    .replaceAll(`"`, "")
    .split(" ")
    .slice(0, 5)
    .join("-")}`.toLowerCase();

  const { displayImage, isLoading } = useToTransparentImage(images[0]);
  const [size, setSize] = useState<{ width: string; height: string }>({
    width: "993px",
    height: "550px",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSize({ width: "100%", height: "100vh" });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`!w-[${size.width}] !h-[${size.height}]`}>
      <div
        className={clsx("w-full h-full", {
          "pointer-events-none opacity-50": isLoading,
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
      {/* <pre>{JSON.stringify(uploadedDesignState?.annotations, null, 3)}</pre> */}
    </div>
  );
};

export default CouponImageEditor;
