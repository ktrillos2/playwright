"use client";
import { categoryActions, commerceActions } from "@/actions";
import { Category, Commerce, LogCategory, LogType } from "@/interfaces";
import { generalService } from "@/service";
import { Avatar, Button, Image, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CouponsScraperMultiSelect = () => {
  const [platform, setPlatform] = useState<any>([]);
  const [category, setCategory] = useState<any>(new Set([]));

  const [loading, setLoading] = useState(false);

  const [platforms, setPlatforms] = useState<Commerce[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const getPlatformsAndCategories = async () => {
    try {
      const [platforms] =  await Promise.all ([
        commerceActions.getCommerces(),
        // categoryActions.getCategories()
      ]) 
      setPlatforms(platforms);


      // setCategories(categories);
    } catch (error) {}
  };

  useEffect(() => {
    getPlatformsAndCategories();
  }, []);

  // const categories = [
  //   { name: "Tecnologia", value: "/tecnologia" },
  //   { name: "Celulares", value: "/tecnologia/celulares" },
  //   { name: "Vinos y licores", value: "/vinos-y-licores" },
  // ];

  const scrape = async () => {
    console.log(category);
    if (category.size === 0) {
      return toast.error("La categoría es obligatoria");
    }
    await generalService.createLogMessage({
      category: LogCategory.COUPON,
      type: LogType.LOADING,
      message: "Scrapeando Exito",
    });
    const params = {
      category: category,
    };
    await generalService.scrapeExito(params);
  };

  return (
    <div className="w-full flex justify-center items-center gap-4">
      {loading ? (
        <span>Cargando...</span>
      ) : (
        <>
          <Select
            items={platforms}
            label="Plataforma"
            className="w-1/6"
            variant="underlined"
            selectedKeys={platform}
            onSelectionChange={setPlatform}
            classNames={{
              label: "group-data-[filled=true]:-translate-y-5",
              trigger: "min-h-unit-18",
            }}
            renderValue={(items) => {
              return items.map((platform) => (
                <div className="flex gap-2 items-center" key={platform.key}>
                  <Avatar src={platform.data?.image} alt="image" size="sm" />
                  <div className="flex flex-col">
                    <span className="text-small">{platform.data?.name}</span>
                  </div>
                </div>
              ));
            }}
          >
            {(platform) => (
              <SelectItem key={platform.name} textValue={platform.name}>
                <div className="flex gap-2 items-center">
                  <Avatar src={platform.image} alt="image" size="md" />
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
                selectionMode="multiple"
                label="Selecciona la categoría"
                className="w-1/6"
                variant="underlined"
                selectedKeys={category}
                onSelectionChange={setCategory}
                classNames={{
                  trigger: "min-h-unit-18",
                }}
              >
                {(category) => (
                  <SelectItem key={category._id} textValue={category._id}>
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col">
                        <span className="text-small">{category._id}</span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
              <Button onClick={scrape}>Scrapear</Button>
            </>
          )}
        </>
      )}
    </div>
  );
};
