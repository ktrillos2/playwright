"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { createSearchParams } from "@/helpers";
import { transformData } from "../helpers/actions.helpers";

interface QueryOptions {
  transformNumber?: boolean;
  transformToArray?: boolean;
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

  const queryTransform = (value: string, options: QueryOptions) => {
    const { transformNumber = false, transformToArray = false } = options;
    if (transformToArray && value.includes(",")) {
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

  const getQueries = <T = Object>(options: QueryOptions = {}) => {
    const params = new URLSearchParams(searchParams);

    const queries: any = {};

    params.forEach((value, key) => {
      queries[key] = queryTransform(value, options);
    });

    return queries as T;
  };

  const getQuery = (key: string, options: QueryOptions = {}) => {
    const params = new URLSearchParams(searchParams);
    const value = params.get(key);
    return value ? queryTransform(value, options) : null;
  };

  return {
    setQueries,
    getQueries,
    getQuery,
  };
};
