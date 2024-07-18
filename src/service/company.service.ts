import { AUTH_URL } from "@/config";

import ServiceClass from "./ServiceClass";

class CompanyService extends ServiceClass {
  async getExternalCompanies() {
    return await super.getQuery<any>({
      URL: AUTH_URL,
      path: "company/list-external",
    });
  }
}

export const companyService = new CompanyService();
