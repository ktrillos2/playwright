import { ReadonlyURLSearchParams } from "next/navigation";

export const createSearchParams = (searchParams: ReadonlyURLSearchParams, queries: Record<string, string | number>) => {
  const params = new URLSearchParams(searchParams);
  Object.entries(queries).forEach(([key, value]) => {
    params.set(key, value.toString());
  })
  return '?' + params.toString()
}