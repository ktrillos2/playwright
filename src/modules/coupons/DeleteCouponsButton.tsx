"use client";

import { couponActions } from "@/actions";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export const DeleteCouponsButton = () => {
  const router = useRouter();

  const handleDeleteCoupons = async () => {
    await couponActions.deleteAllCoupons();
    router.refresh();
  };
  
  return (
    <Button color="danger" onClick={handleDeleteCoupons}>
      Borrar cupones
    </Button>
  );
};
