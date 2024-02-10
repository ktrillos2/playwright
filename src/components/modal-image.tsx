"use client";
import React, { use, useEffect, useState } from "react";

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
import { Exito } from "@/interfaces";

import NextImage from "next/image";

import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";

import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import { toPng } from "html-to-image";
import { useToPng } from "@hugocxl/react-to-image";

interface Props {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  info: Exito;
}

export const ModalImage: React.FC<Props> = ({ isOpen, onOpenChange, info }) => {
  const [displayImage, setDisplayImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { name, discountPercentage, PriceWithoutDiscount, lowPrice, image } =
    info || {};

  const [state, convertToPng, ref] = useToPng({
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.download = `${name.toLowerCase().split(" ").join("-")}.png`;
      link.href = data;
      link.click();
    },
  });

  // const [backgroundColor, setBackgroundColor] = useState<string>(
  //   "linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)"
  // );
  // const { setSolid, setGradient } = useColorPicker(
  //   backgroundColor,
  //   setBackgroundColor
  // );

  useEffect(() => {
    const convertImage = async () => {
      setDisplayImage(null);
      if (!info) return;
      setIsLoading(true);
      try {
        const response = await removeBackground(info.image[0].url);
        setDisplayImage(response);
      } catch (error) {
        console.log(error);
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
                    // style={{ background: backgroundColor }}
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
                    <div className="absolute bg-[#e81819] text-white text-md w-10 h-10 rounded-full grid place-content-center right-3 bottom-3">
                      {discountPercentage}%
                    </div>
                    <div className="absolute text-black bottom-3 left-3">
                      <span className="line-through block text-xs">
                        ${PriceWithoutDiscount?.toLocaleString()}
                      </span>
                      <span className="font-bold">
                        {"$"}
                        {lowPrice?.toLocaleString()}
                      </span>
                    </div>
                    <div className="absolute bottom-0">
                      <div className={!displayImage ? "opacity-50" : ""}>
                        <Image
                          src={displayImage ?? image[0].url}
                          alt="image"
                          width={200}
                        ></Image>
                      </div>
                    </div>
                  </div>
                  {isLoading ? (
                    <p className="text-center text-sm">Quitando fondo...</p>
                  ) : null}{" "}
                </div>
                {/* <div className="scale-50 w-[200px] h-[200px]">
                  <ColorPicker
                    value={backgroundColor}
                    onChange={setBackgroundColor}
                  />
                </div> */}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              <Button color="primary" onPress={convertToPng}>
                Descargar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
