import { Metadata } from "next";

import { DeleteInmueblesButton, InmueblesTable } from "@/modules";
import { generalService } from "@/service";
import { Button } from "@nextui-org/react";
import Link from "next/link";

interface Props {
  searchParams: {
    page: string;
    limit: string;
  };
}

export const metadata: Metadata = {
  title: "Inmuebles",
  description: "Tabla de inmuebles",
};

export default async function InmueblesPage({ searchParams }: Props) {
  const page = +searchParams.page || 1;
  const limit = +searchParams.limit || 5;

  const { docs, totalPages, totalDocs } = await generalService.getInmuebles({
    page,
    limit,
  });

  return (
    <div>
       <div className="flex justify-between items-center">
        <h1 className="text-left">Inmuebles Spider</h1>
        <div className="flex gap-2">
          <Button as={Link} href="/inmuebles/scraper" color="success">
            Scrappear
          </Button>
          <DeleteInmueblesButton />
        </div>
      </div>
      <InmueblesTable
        inmuebles={docs}
        page={page ?? 1}
        totalPages={totalPages}
        totalInmuebles={totalDocs}
        limit={limit}
      />
    </div>
  );
}
