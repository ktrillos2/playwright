"use client";
import { LogCategory, LogType } from "@/interfaces";
import { generalService } from "@/service";
import { Button, Image, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CouponsScraperMultiSelect = () => {
  const [platform, setPlatform] = useState<any>([]);
  const [category, setCategory] = useState<any>([]);
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

  const categories = [
    { name: "Tecnologia", value: "/tecnologia" },
    { name: "Celulares", value: "/tecnologia/celulares" },
    { name: "Vinos y licores", value: "/vinos-y-licores" },
  ];

  const scrape=async()=>{
    console.log(category)
    if(category.size===0){
      return toast.error("La categoría es obligatoria")
    }
    await generalService.createLogMessage({ 
      category: LogCategory.COUPON,
      type: LogType.LOADING,
      message: "Scrapeando Exito",
    });
    const params={
      category:category
    }
    await generalService.scrapeExito(params);
  }

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
            items={categories}
            label="Selecciona la categoría"
            className="w-1/6"
            variant="bordered"
            selectedKeys={category}
        onSelectionChange={setCategory}
          >
            {(category) => (
              <SelectItem key={category.value} textValue={category.name}>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col">
                    <span className="text-small">{category.name}</span>
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>
          <Button onClick={scrape}>Scrapear</Button>
        </>
      )}
    </div>
  );
};
