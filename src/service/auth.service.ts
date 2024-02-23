import { AUTH_URL } from "@/config";

import ServiceClass from "./ServiceClass";

import { User } from "@/interfaces";

interface LoginResponse {
  token: string;
  payload: User;
}

class AuthService extends ServiceClass {
  async login(user: string, password: string) {
    const body = { user, password, type: "ADMIN" };
    return await super.postQuery<LoginResponse>({
      URL: AUTH_URL,
      path: "user/login",
      body,
    });
  }
}

export const authService = new AuthService();
