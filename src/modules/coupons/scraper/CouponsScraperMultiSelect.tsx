"use client";
import { categoryActions, commerceActions, scrapeActions } from "@/actions";
import { Category, Commerce, LogCategory, LogType } from "@/interfaces";
import { generalService } from "@/service";
import { Avatar, Button, Image, Select, SelectItem } from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { SelectCategory, SelectCommerce } from "..";

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

        toast.success(`Se ha scrapeado la categoría: ${categoryName}`);
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
            <SelectCommerce
              commerces={commerces}
              selectedKeys={platform}
              onSelectionChange={setPlatform}
            />
            {platform.size > 0 && (
              <>
                <SelectCategory
                  categories={categoriesBySelectedCommerce}
                  selectedKeys={selectedCategories}
                  onSelectionChange={setSelectedCategory}
                  selectionMode="multiple"
                />
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
