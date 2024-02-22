"use client";
import { couponLayout } from "@/helpers";
import { useToTransparentImage } from "@/hooks";
import { Coupon } from "@/interfaces";
import React, { useEffect, useState } from "react";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from "react-filerobot-image-editor";

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

  return (
    <div className={""}>
      <div style={{ height: "calc(100vh - 100px)" }}>
        <FilerobotImageEditor
          theme={{}}
          language="es"
          source={"default-coupon-bg.png"}
          onSave={(editedImageObject, designState) => {
            const link = document.createElement("a");
            link.download = `${name.toLowerCase().split(" ").join("-")}.png`;
            link.href = editedImageObject.imageBase64 as any
            link.click();
          }}
          // onClose={closeImgEditor}
          annotationsCommon={{
            fill: "#000000",
          }}
          Text={{ text: "Escribe aquí tu contenido..." }}
          // Rotate={{ angle: 90, componentType: "slider" }}
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
