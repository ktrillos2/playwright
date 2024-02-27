import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authService } from "@/service";
import { IUser } from "../../nextauth";
import { redirect } from "next/navigation";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user: {
          label: "Correo",
          type: "text",
          placeholder: "ejemplo@correo.com",
        },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials) return null;
        const { user, password } = credentials;
        try {
          const response = await authService.login(user, password);
          const { payload, token } = response;
          return { ...payload, token };
        } catch (error: any) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user }) {
      if (user && (user as IUser)._id) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      if (session && session.user && token._id) {
        const { token: accessToken, iat, exp, jti, ...user }: any = token;
        session = {
          ...session,
          user: { ...session.user, ...user },
          accessToken,
        };
      }
      return session;
    },
  },
};

export const handler = NextAuth(authConfig);

export const { signIn, signOut, auth } = handler;

export const getServerAuthSession = () => getServerSession(authConfig);

export const adminAuthMiddleware = async () => {
  const authSession = await getServerAuthSession()
  if (!authSession?.accessToken) {
    redirect("/api/auth/signin")
  }
};
