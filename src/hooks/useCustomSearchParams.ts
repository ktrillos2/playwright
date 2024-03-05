"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { createSearchParams } from "@/helpers";
import { transformData } from "../helpers/actions.helpers";

interface QueryOptions<T = string> {
  transformNumber?: boolean;
  transformToArray?: T[];
}

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

  const queryTransform = <T>(
    value: string,
    key: keyof T,
    options: QueryOptions<keyof T>
  ) => {
    const { transformNumber = false, transformToArray = [] } = options;
    if (transformToArray?.includes(key)) {
      const array = value.split(",");
      if (transformNumber) {
        return array.map((e) => (isNaN(+e) ? e : +e));
      }
      return array;
    }
    if (transformNumber && !isNaN(+value)) {
      return +value;
    }
    return value;
  };

  const getQueries = <T = Object>(
    options: QueryOptions<keyof T> & { select?: (keyof T)[] } = {}
  ) => {
    const { select, ...restOptions } = options;

    const params = new URLSearchParams(searchParams);

    const queries: any = {};

    if (select) {
      select.forEach((key) => {
        const value = params.get(key as string);
        queries[key] = value
          ? queryTransform<T>(value as string, key as keyof T, restOptions)
          : null;
      });

      return queries as Partial<T>;
    }

    params.forEach((value, key) => {
      queries[key] = queryTransform<T>(value, key as keyof T, restOptions);
    });

    return queries as T;
  };

  const getQuery = (key: string, options: QueryOptions = {}) => {
    const params = new URLSearchParams(searchParams);
    const value = params.get(key);

    return value ? queryTransform(value, key, options) : null;
  };

  return {
    setQueries,
    getQueries,
    getQuery,
  };
};
