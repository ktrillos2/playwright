"use server";

import { signIn, signOut } from "next-auth/react";

export async function authenticate(user?: string, password?: string) {
  try {
    await signIn("credentials", {
      user,
      password,
      redirect: false,
    });

    return true;
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

export const login = async (user: string, password: string) => {
  try {
    await signIn("credentials", {
      user,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo iniciar sesión",
    };
  }
};

export const logout = async () => {
  try {
    await signOut();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo cerrar sesión",
    };
  }
};
