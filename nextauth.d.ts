import { DefaultSession, DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  _id: string;
  full_name: string;
  types: string[];
  roles: string[];
  email: string;
  idCompany: null;
  login_google: boolean;
  img: null;
  companyKumonera: null;
}

declare module "next-auth" {
  interface Session {
    user: IUser;
    accessToken: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}