import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@nextui-org/react";

import { CouponsTable, DeleteCouponsButton } from "@/modules";
import { generalService } from "@/service";
import { categoryActions, commerceActions, couponActions } from "@/actions";

interface Props {
  searchParams: {
    page?: string;
    limit?: string;
    commerces?: string;
    categories?: string;
  };
}

export const metadata: Metadata = {
  title: "Cupones",
  description: "Tabla de cupones",
};

export default async function CouponsPage({ searchParams }: Props) {
  const page = +searchParams.page! || 1;
  const limit = +searchParams.limit! || 5;
  const commerces = searchParams.commerces?.split(",");
  const categories = searchParams.categories?.split(",");

  const [paginatedCoupons, commercesResponse, categoriesResponse] =
    await Promise.all([
      couponActions.getPaginateCouponByCategoryAndCommerce({
        page,
        limit,
        categories,
        commerces,
      }),
      commerceActions.getCommerces(),
      categoryActions.getCategories(),
    ]);

  const { docs: coupons, totalPages, totalDocs } = paginatedCoupons;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-left">Cupones Spider</h1>
        <div className="flex gap-2">
          <Button as={Link} href="/coupons/scraper" color="success">
            Scrappear
          </Button>
          <DeleteCouponsButton />
        </div>
      </div>
      <CouponsTable
        coupons={coupons}
        page={page ?? 1}
        totalPages={totalPages}
        totalInmuebles={totalDocs}
        limit={limit}
        commerces={commercesResponse}
        categories={categoriesResponse}
      />
    </div>
  );
}
