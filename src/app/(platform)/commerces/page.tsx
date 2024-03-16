import { commerceActions } from "@/actions";
import { CommercesTable } from "@/modules";
import { Button } from "@nextui-org/react";
import Link from "next/link";

export default async function CommercePage() {
  const commerces = await commerceActions.getCommerces();

  return (
    <div className="grid gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-left">Tabla de comercios</h1>
        <div className="flex gap-2">
          <Button as={Link} href="/commerces/create" color="success">
            Crear comercio
          </Button>
        </div>
      </div>
      <CommercesTable commerces={commerces} />
    </div>
  );
}
