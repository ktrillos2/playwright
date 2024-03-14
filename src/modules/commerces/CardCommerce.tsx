"use client";

import React from "react";

import {
  Button,
  Card,
  CardFooter,
  Image,
  Link,
} from "@nextui-org/react";
import { IoIosImages } from "react-icons/io";

interface Props {
  name: string;
  image: string;
  url: string;
  showImage: boolean;
  validUrl: boolean;
}

export const CardCommerce: React.FC<Props> = ({
  name,
  image,
  url,
  showImage,
  validUrl,
}) => {
  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none w-[200px] h-[200px]"
    >
      <div className="w-[200px] h-[200px] grid place-content-center bg-gradient-to-tl from-green-300 via-blue-500 to-purple-600">
        {showImage ? (
          <Image
            alt="Commerce image"
            className="object-cover"
            height={200}
            src={image}
            width={200}
          />
        ) : (
          <IoIosImages size={160} />
        )}
      </div>

      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">{name || "Nombre"}</p>
        <Button
          className="text-tiny text-white bg-black/20"
          variant="flat"
          color="default"
          radius="lg"
          size="sm"
          as={Link}
          href={url}
          isDisabled={validUrl}
        >
          Ver más
        </Button>
      </CardFooter>
    </Card>
  );
};
