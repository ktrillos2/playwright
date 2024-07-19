import { AUTH_URL } from "@/config";

import ServiceClass from "./ServiceClass";
import { IUser } from "../../nextauth";

interface LoginResponse {
  token: string;
  payload: IUser;
}

class AuthService extends ServiceClass {
  async login(user: string, password: string) {
    const body = { user, password, type: "ADMIN" };
    return await super.postQuery<LoginResponse>({
      URL: AUTH_URL,
      path: "admin-users/login",
      body,
    });
  }
}

export const authService = new AuthService();
