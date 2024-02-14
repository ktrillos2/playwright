import { NextRequest } from "next/server";

export const getSearchParams = (request: NextRequest) => {
  return Object.fromEntries(request.nextUrl.searchParams);
};
