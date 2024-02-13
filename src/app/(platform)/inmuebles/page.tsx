import { Metadata } from "next";

import { InmueblesTable } from "@/modules";
import { generalService } from "@/service";

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
  const limit = +searchParams.limit || 25;

  const { docs, totalPages, totalDocs } = await generalService.getInmuebles({
    page,
    limit,
  });

  return (
    <div>
      <h1 className="text-left">Inmuebles Spider</h1>
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
