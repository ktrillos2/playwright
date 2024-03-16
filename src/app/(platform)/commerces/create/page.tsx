import { CommerceForm } from "@/modules";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crea un comercio",
  description: "Formulario para la creación de comercios",
};

export default function CreateCommercePage() {
  return (
    <div>
     <CommerceForm />
    </div>
  );
}
