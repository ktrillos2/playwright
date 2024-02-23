import { Errors } from "@/enums";
import { authService } from "@/service";
import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
      async authorize(credentials) {
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
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) return { ...token, ...user };
  //     console.log({token, user})
  //     return token;
  //   },

  //   async session(a: any) {
      
  //     const { token, session } = a
  //     console.log(session.user)
  //     return session;
  //   },
  // },
};

export const handler = NextAuth(authConfig);

export const { signIn, signOut, auth } = handler;

export const getServerAuthSession = () => getServerSession(authConfig);
