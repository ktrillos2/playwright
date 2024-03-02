export const createSearchParams = (
  searchParams: URLSearchParams,
  queries: Record<string, string | number>
) => {
  const params = new URLSearchParams(Array.from(searchParams.entries()));
  Object.entries(queries).forEach(([key, value]) => {
    if (!value) return params.delete(key);
    params.set(key, value.toString());
  });
  return params;
};
