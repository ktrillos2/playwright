import ServiceClass from "./ServiceClass";

import { ApiKeys, Urls } from "../enums";
import { Coupon, Inmueble } from "../interfaces";
import { BASE_API_URL } from "@/config";
import { PaginationResponse } from "@/types";

class GeneralService extends ServiceClass {
  async scrappingData(body: any): Promise<any> {
    return await super.postQuery<Inmueble[]>({
      URL: BASE_API_URL,
      path: "api/scrappy",
      body,
    });
  }

  async getInmuebles({
    page,
    limit,
  }: {
    page?: string | number;
    limit?: string | number;
  }): Promise<PaginationResponse<Inmueble>> {
    const params = { page, limit };

    return await super.getQuery<PaginationResponse<Inmueble>>({
      URL: BASE_API_URL,
      path: "api/inmuebles",
      params,
    });
  }

  async deleteInmuebles(): Promise<void> {
    return await super.deleteQuery({
      URL: BASE_API_URL,
      path: "api/inmuebles",
    });
  }

  async getCoupons({
    page,
    limit,
  }: {
    page?: string | number;
    limit?: string | number;
  }): Promise<PaginationResponse<Coupon>> {
    const params = { page, limit };

    return await super.getQuery<PaginationResponse<Coupon>>({
      URL: BASE_API_URL,
      path: "api/coupons",
      params,
    });
  }

  async deleteCoupons(): Promise<void> {
    return await super.deleteQuery({
      URL: BASE_API_URL,
      path: "api/coupons",
    });
  }

  async getUserAgents(): Promise<any> {
    return await super.getQuery({
      URL: Urls.SCRAPE_OPS,
      path: "user-agents",
      params: {
        api_key: ApiKeys.SCRAPE_OPS,
        num_results: 50,
      },
    });
  }

  async getBrowserHeaders(): Promise<any> {
    return await super.getQuery({
      URL: Urls.SCRAPE_OPS,
      path: "browser-headers",
      params: {
        api_key: ApiKeys.SCRAPE_OPS,
        num_results: 50,
      },
    });
  }
  
}

export const generalService = new GeneralService();
