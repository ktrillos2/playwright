import { Metadata } from "next";

import { CouponsTable, InmueblesTable } from "@/modules";
import { generalService } from "@/service";
import { formatCalculatedCoupon } from "@/helpers";

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

  const { docs, totalPages, totalDocs } = await generalService.getCoupons({
    page,
    limit,
  });

  const coupons = formatCalculatedCoupon(docs);

  return (
    <div>
      <h1 className="text-left">Cupones Spider</h1>
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
