import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@nextui-org/react";

import { CouponsTable, DeleteCouponsButton } from "@/modules";
import { generalService } from "@/service";
import { couponActions } from "@/actions";

interface Props {
  searchParams: {
    page: string;
    limit: string;
  };
}

export const metadata: Metadata = {
  title: "Cupones",
  description: "Tabla de cupones",
};

export default async function CouponsPage({ searchParams }: Props) {
  const page = +searchParams.page || 1;
  const limit = +searchParams.limit || 5;

  const {
    docs: coupons,
    totalPages,
    totalDocs,
  } = await couponActions.getPaginateCoupons({
    page,
    limit,
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-left">Cupones Spider</h1>
        <div className="flex gap-2">
          {/* <Button as={Link} href="/coupons/scraper" color="success">
            Scrappear
          </Button> */}
          <DeleteCouponsButton />
        </div>
      </div>
      <CouponsTable
        coupons={coupons}
        page={page ?? 1}
        totalPages={totalPages}
        totalInmuebles={totalDocs}
        limit={limit}
      />
    </div>
  );
}
