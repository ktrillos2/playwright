import { getExternalCompanies } from "@/actions/commerce/commerce.actions";
import { CommerceForm } from "@/modules";
import { Metadata } from "next";
import { getSession } from "next-auth/react";

export const metadata: Metadata = {
  title: "Crea un comercio",
  description: "Formulario para la creación de comercios",
};

export default async function CreateCommercePage() {
  const a = getSession();
  console.log(a)
  const externalCompanies = await getExternalCompanies();

  console.log(externalCompanies);

  return (
    <div>
      <CommerceForm />
    </div>
  );
}
