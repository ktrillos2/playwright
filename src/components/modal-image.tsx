"use client";
import React, { useEffect, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@nextui-org/react";
import { removeBackground } from "@/helpers";
import { Coupon, CalculatedCoupon } from "@/interfaces";

import NextImage from "next/image";

import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";

import { useToPng } from "@hugocxl/react-to-image";

interface Props {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  info: CalculatedCoupon;
}

export const ModalImage: React.FC<Props> = ({ isOpen, onOpenChange, info }) => {
  const [displayImage, setDisplayImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { name, discountPercentage, priceWithoutDiscount, lowPrice, images } =
    info || {};

  const [showEditor, setShowEditor] = useState(false);

  const [state, convertToPng, ref] = useToPng({
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.download = `${name.toLowerCase().split(" ").join("-")}.png`;
      link.href = data;
      link.click();
    },
  });

  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const { setSolid, setGradient } = useColorPicker(
    backgroundColor,
    setBackgroundColor
  );

  useEffect(() => {
    const convertImage = async () => {
      setDisplayImage(null);
      if (!info) return;
      setIsLoading(true);
      try {
        const response = await removeBackground(info.images[0]);
        setDisplayImage(response)
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    convertImage();
  }, [info]);

  useEffect(() => {
    if (!isOpen) {
      setDisplayImage(null);
    }
  }, [isOpen]);
  
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      scrollBehavior={"outside"}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Bienvenido al creador de cupon
            </ModalHeader>
            <ModalBody className="items-center">
              <div className="flex gap-8">
                <div>
                  <div
                    ref={ref}
                    className="w-[500px] h-[250px] bg-white bg-gradient-to-br from-[#fce802] from-25% relative flex justify-center"
                    style={{ background: backgroundColor }}
                  >
                    <div className="absolute top-3 px-3 flex gap-3 items-center">
                      <NextImage
                        src={"/exito-logo.png"}
                        width={50}
                        height={50}
                        alt="logo exito"
                        className="border-[0.5px] rounded-full border-black"
                      ></NextImage>
                      <h1 className="font-bold leading-4 text-black">{name}</h1>
                    </div>
                    <div className="absolute bg-[#e81819] text-white text-xl w-14 h-14 rounded-full grid place-content-center right-3 bottom-3 font-bold">
                      {discountPercentage}%
                    </div>
                    <div className="absolute text-black bottom-3 left-3">
                      <span className="line-through block text-xs">
                        ${priceWithoutDiscount?.toLocaleString()}
                      </span>
                      <span className="font-bold">
                        {"$"}
                        {lowPrice?.toLocaleString()}
                      </span>
                    </div>
                    <div className="absolute bottom-0">
                      <div className={!displayImage ? "opacity-50" : ""}>
                        <Image
                          src={displayImage ?? images[0]}
                          alt="image"
                          width={200}
                        ></Image>
                      </div>
                    </div>
                  </div>
                  {isLoading ? (
                    <p className="text-center text-sm pt-4">
                      Quitando fondo...
                    </p>
                  ) : null}{" "}
                  <div className="pt-4 flex gap-2">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cerrar
                    </Button>
                    <Button
                      disabled={!displayImage}
                      color="primary"
                      onPress={convertToPng}
                    >
                      Descargar
                    </Button>
                    <Button
                      disabled={!displayImage}
                      onPress={() => setShowEditor(!showEditor)}
                    >
                      {showEditor ? "Quitar editor" : "Mostrar editor"}
                    </Button>
                  </div>
                </div>
                <div className="">
                  {showEditor ? (
                    <ColorPicker
                      value={backgroundColor}
                      onChange={setBackgroundColor}
                    />
                  ) : null}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
