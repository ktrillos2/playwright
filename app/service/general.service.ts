import ServiceClass from "./ServiceClass";

import { ApiKeys, Urls } from "../enums";
import { Inmueble } from "../interfaces";

class GeneralService extends ServiceClass {
  async scrappingData(body: any): Promise<any> {
    return await super.postQuery<Inmueble[]>({
      URL: "",
      path: "api",
      body,
    });
  }

  async getInmuebles(): Promise<Inmueble[]> {
    return await super.getQuery<Inmueble[]>({
      URL: "",
      path: "api/inmuebles",
    });
  }

  async deleteInmuebles(): Promise<void> {
    return await super.deleteQuery({
      URL: "",
      path: "api/inmuebles",
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
