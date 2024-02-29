"use client";
import { categoryActions, commerceActions, scrapeActions } from "@/actions";
import { Category, Commerce, LogCategory, LogType } from "@/interfaces";
import { generalService } from "@/service";
import { Avatar, Button, Image, Select, SelectItem } from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export const CouponsScraperMultiSelect = () => {
  const [platform, setPlatform] = useState<any>(new Set([]));
  const [selectedCategories, setSelectedCategory] = useState<any>(new Set([]));

  const [loading, setLoading] = useState(false);
  const [loadingScraper, setLoadingScraper] = useState(false);

  const [commerces, setCommerces] = useState<Commerce[]>([]);

  const categoriesBySelectedCommerce = useMemo(() => {
    setSelectedCategory(new Set([]));
    const [parsedPlatform] = platform;
    if (!parsedPlatform) return [];
    const selectedPlatform = commerces.find((e) => e._id === parsedPlatform);
    return selectedPlatform?.categories || [];
  }, [platform]);

  const getPlatformsAndCategories = async () => {
    setLoading(true);
    try {
      const commerces = await commerceActions.getCommerces();
      setCommerces(commerces);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlatformsAndCategories();
  }, []);

  const scrape = async () => {
    const [selectedPlatform] = platform;
    const categories = [...selectedCategories];

    const responses = [];

    const commerce = commerces.find((e) => e._id === selectedPlatform);

    if (!commerce) return;

    setLoadingScraper(true);
    for (const category of categories) {
      const categoryName = commerce.categories.find(
        (e) => e.category._id === category
      )?.category.name;
      try {
        const response = await scrapeActions.scrapeCommerceByCategory(
          selectedPlatform,
          category
        );
        responses.push(response);

        toast.success(`Se ha scrapeado la categoria: ${categoryName}`);
      } catch (error) {
        toast.error(`Error en la categoría ${categoryName}:`);
      }
    }
    setLoadingScraper(false);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <div className="w-full flex justify-center items-center gap-4">
        {loading ? (
          <span>Cargando...</span>
        ) : (
          <>
            <Select
              items={commerces}
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
              {(commerce) => (
                <SelectItem key={commerce._id} textValue={commerce.name}>
                  <div className="flex gap-2 items-center">
                    <Avatar src={commerce.image} alt="image" size="md" />
                    <div className="flex flex-col">
                      <span className="text-small">{commerce.name}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
            {platform.size > 0 && (
              <>
                <Select
                  items={categoriesBySelectedCommerce}
                  selectionMode="multiple"
                  label="Selecciona la categoría"
                  className="w-1/6"
                  variant="underlined"
                  selectedKeys={selectedCategories}
                  onSelectionChange={setSelectedCategory}
                  classNames={{
                    trigger: "min-h-unit-18",
                  }}
                >
                  {(category) => (
                    <SelectItem
                      key={category.category._id}
                      textValue={category.category.name}
                    >
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                          <span className="text-small">
                            {category.category.name}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                <Button
                  onClick={scrape}
                  variant="flat"
                  color={selectedCategories.size ? "success" : "default"}
                  isDisabled={!selectedCategories.size || loadingScraper}
                >
                  Scrapear
                </Button>
              </>
            )}
          </>
        )}
      </div>
      {loadingScraper ? "Se está scrapeando, porfavor espere..." : null}
    </div>
  );
};
