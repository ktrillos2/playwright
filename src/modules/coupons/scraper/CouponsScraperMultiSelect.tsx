"use client";
import { Button, Image, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";

export const CouponsScraperMultiSelect = () => {
  const [platform, setPlatform] = useState<any>([]);
  const platforms = [
    {
      name: "Exito",
      image: "/page-images/exito-logo.png",
    },
    {
      name: "Metro",
      image: "/page-images/metro-logo.png",
    },
  ];

  return (
    <div className="w-full flex justify-center items-center gap-4">
      <Select
        items={platforms}
        label="Plataforma"
        placeholder="Selecciona la plataforma"
        className="w-1/6"
        variant="bordered"
        selectedKeys={platform}
        onSelectionChange={setPlatform}
      >
        {(platform) => (
          <SelectItem key={platform.name} textValue={platform.name}>
            <div className="flex gap-2 items-center">
              <Image src={platform.image} alt="image" className="w-12"></Image>
              <div className="flex flex-col">
                <span className="text-small">{platform.name}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
      {platform.size > 0 && (
        <>
          <Select
            items={platforms}
            label="Selecciona la categoría"
            className="w-1/6"
            variant="bordered"
          >
            {(platform) => (
              <SelectItem key={platform.name} textValue={platform.name}>
                <div className="flex gap-2 items-center">
                  <Image
                    src={platform.image}
                    alt="image"
                    className="w-12"
                  ></Image>
                  <div className="flex flex-col">
                    <span className="text-small">{platform.name}</span>
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>
          <Button>Scrapear</Button>
        </>
      )}
    </div>
  );
};
