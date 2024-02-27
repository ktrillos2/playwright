import { LoginForm } from "@/modules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicia sesión",
};

interface Props {
  searchParams: {
    error: string;
  };
}

export default function LoginPage({ searchParams }: Props) {
  const { error } = searchParams;
  return (
    <div className="w-full h-full grid place-items-center p-5 md:pt-20">
      <LoginForm error={error} />
    </div>
  );
}
