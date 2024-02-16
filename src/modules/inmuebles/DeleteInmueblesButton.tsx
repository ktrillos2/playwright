"use client";

import { generalService } from "@/service";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export const DeleteInmueblesButton = () => {
  const router = useRouter();

  const handleDeleteInmuebles = async () => {
    await generalService.deleteInmuebles();
    router.refresh();
  };

  return (
    <Button color="danger" onClick={handleDeleteInmuebles}>
      Borrar inmuebles
    </Button>
  );
};
