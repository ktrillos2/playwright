import ServiceClass from "./ServiceClass";

import { ApiKeys, Urls } from "../enums";

class GeneralService extends ServiceClass {
  async getUserAgents(): Promise<any> {
    return await super.getQuery({
      URL: Urls.SCRAPE_OPS,
      path: 'user-agent',
      params: {
        api_key: ApiKeys.SCRAPE_OPS,
        num_results: 50
      }
    });
  }

  async getBrowserHeaders(): Promise<any> {
    return await super.getQuery({
      URL: Urls.SCRAPE_OPS,
      path: 'browser-headers',
      params: {
        api_key: ApiKeys.SCRAPE_OPS,
        num_results: 50
      }
    });
  }
}

export const generalService = new GeneralService();
