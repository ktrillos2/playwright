"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { createSearchParams } from "@/helpers";

export const useCustomSearchParams = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();
  const [queries, setQueries] = useState<Record<
    string,
    string | number
  > | null>(null);

  useEffect(() => {
    if (!queries) return;
    const newSearchParams = createSearchParams(searchParams, queries);
    router.replace(pathname + "?" + newSearchParams);
  }, [queries]);

  const getQueries = <T = Object>(): T => {
    const params = new URLSearchParams(searchParams);
    return Object.entries(params).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {}
    ) as T;
  };

  const getQuery = (key: string) => {
    const params = new URLSearchParams(searchParams);
    return params.get(key);
  };

  return {
    setQueries,
    getQueries,
    getQuery
  };
};
