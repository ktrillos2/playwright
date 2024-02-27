import { LoginForm } from "@/modules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicia sesión",
};

export default function LoginPage() {
  return (
    <div className="w-full h-full grid place-items-center p-5 md:pt-20">
      <LoginForm />
    </div>
  );
}
