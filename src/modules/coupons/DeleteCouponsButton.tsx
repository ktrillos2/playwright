"use client";

import { generalService } from "@/service";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export const DeleteCouponsButton = () => {
  const router = useRouter();

  const handleDeleteCoupons = async () => {
    await generalService.deleteCoupons();
    router.refresh();
  };
  
  return (
    <Button color="danger" onClick={handleDeleteCoupons}>
      Borrar cupones
    </Button>
  );
};
