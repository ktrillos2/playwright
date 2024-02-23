import NextAuth, { DefaultSession } from "next-auth";
import { User } from "@/interfaces";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      full_name: string;
      types: string[];
      roles: string[];
      email: string;
      idCompany: null;
      login_google: boolean;
      img: null;
      companyKumonera: null;
    } & DefaultSession["user"];
  }
}
