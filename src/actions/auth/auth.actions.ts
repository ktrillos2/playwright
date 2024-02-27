"use server";

import { signIn } from "next-auth/react";

export async function authenticate(user?: string, password?: string) {
  try {
    // await sleep(2);
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
    console.log(error)
    return {
      ok: false,
      message: "No se pudo iniciar sesión",
    };
  }
};
