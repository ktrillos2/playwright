import { getExternalCompanies } from "@/actions/commerce/commerce.actions";
import { getServerAuthSession } from "@/config";
import { CommerceForm } from "@/modules";
import { Metadata } from "next";
import { getSession } from "next-auth/react";

export const metadata: Metadata = {
  title: "Crea un comercio",
  description: "Formulario para la creación de comercios",
};

export default async function CreateCommercePage() {

  const externalCompanies = await getExternalCompanies();


  return (
    <div>
      <CommerceForm externalCompanies={externalCompanies} />
    </div>
  );
}
