"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Divider, Button } from "@nextui-org/react";
import { RiCoupon2Line } from "react-icons/ri";
import toast from "react-hot-toast";

import { LoggerComponent } from "@/components";
import { SelectCategory, SelectCommerce } from "..";

import { commerceActions, scrapeActions } from "@/actions";
import { Commerce, LogMessage, LogType, SpecialLog } from "@/interfaces";

import { PagePaths } from "@/enums";

export const CouponsScraperMultiSelect = () => {
  const [platform, setPlatform] = useState<any>(new Set([]));
  const [selectedCategories, setSelectedCategory] = useState<any>(new Set([]));

  const [loading, setLoading] = useState(false);
  const [loadingScraper, setLoadingScraper] = useState(false);

  const [commerces, setCommerces] = useState<Commerce[]>([]);

  const [scrapperLogger, setScrapperLogger] = useState<
    (LogMessage | SpecialLog)[]
  >([]);

  const [successScrapper, setSuccessScrapper] = useState(false);

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

    const responses: number[] = [];

    const commerce = commerces.find((e) => e._id === selectedPlatform);

    if (!commerce) return;

    setSuccessScrapper(false);
    setLoadingScraper(true);

    const firstLog: (LogMessage | SpecialLog)[] = [];

    if (scrapperLogger.length) {
      firstLog.unshift(SpecialLog.SEPARATOR);
    }

    firstLog.unshift({
      message: `Empezando a scrapear ${commerce.name}...`,
      createdAt: new Date(),
      type: LogType.INFO,
    });

    setScrapperLogger((prevLogger) => [...firstLog, ...prevLogger]);

    for (const category of categories) {
      const categoryName = commerce.categories.find(
        (e) => e.category._id === category
      )?.category.name;

      setScrapperLogger((prevLogger) => [
        {
          message: "Scrapeando " + categoryName,
          createdAt: new Date(),
          type: LogType.LOADING,
        },
        ...prevLogger,
      ]);

      try {
        const totalProducts = await scrapeActions.scrapeCommerceByCategory(
          selectedPlatform,
          category
        );

        responses.push(totalProducts);

        // responses.push("response");

        setScrapperLogger((prevLogger) => [
          {
            message: `(${totalProducts}) productos scrapeados de ${categoryName} `,
            createdAt: new Date(),
            type: LogType.SUCCESS,
          },
          ...prevLogger,
        ]);

        toast.success(`Se ha scrapeado la categoría: ${categoryName}`);
      } catch (error: any) {
        toast.error(`Error en la categoría ${categoryName}:`);

        setScrapperLogger((prevLogger) => [
          {
            message: "Error en " + categoryName + ": " + error.message,
            createdAt: new Date(),
            type: LogType.ERROR,
          },
          ...prevLogger,
        ]);
      }
    }

    setScrapperLogger((prevLogger) => [
      {
        message: `(${responses.reduce(
          (acc, curr) => acc + curr,
          0
        )}) Productos scrapeados`,
        createdAt: new Date(),
        type: LogType.INFO,
      },
      {
        message: `[${responses.length}/${categories.length}] Categorías scrapeadas correctamente`,
        createdAt: new Date(),
        type: LogType.INFO,
      },
      ...prevLogger,
    ]);

    setSuccessScrapper(true);
    setLoadingScraper(false);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      {loading ? (
        <span>Cargando...</span>
      ) : (
        <div className="flex flex-col gap-x-4 gap-y-2 w-full max-w-[800px] min-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectCommerce
              commerces={commerces}
              selectedKeys={platform}
              onSelectionChange={setPlatform}
              classNames={{
                label: "group-data-[filled=true]:-translate-y-5",
                trigger: "min-h-unit-18",
              }}
            />
            {platform.size ? (
              <SelectCategory
                categories={categoriesBySelectedCommerce}
                selectedKeys={selectedCategories}
                onSelectionChange={setSelectedCategory}
                selectionMode="multiple"
                isCategoryByCommerce
                classNames={{
                  trigger: "min-h-unit-18",
                }}
              />
            ) : (
              <small className="text-xs self-end">
                Selecciona un comercio para ver sus categorías
              </small>
            )}
            {/* {loadingScraper ? "Se está scrapeando, porfavor espere..." : null} */}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={scrape}
              className="flex-1"
              variant="flat"
              size="lg"
              color={selectedCategories.size ? "success" : "default"}
              isDisabled={!selectedCategories.size || loadingScraper}
            >
              Scrapear
            </Button>
            {successScrapper ? (
              <Button
                as={Link}
                href={`/${PagePaths.COUPONS}`}
                size="lg"
                color={"secondary"}
                isIconOnly
              >
                <RiCoupon2Line size={25} />
              </Button>
            ) : null}
          </div>
          {scrapperLogger.length ? (
            <>
              <Divider />
              <LoggerComponent
                messages={scrapperLogger}
                className="max-h-[50vh] md:max-h-[55vh]"
              />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};
