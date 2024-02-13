import { InmueblesTable } from "@/modules";
import { generalService } from "@/service";

interface Props {
  searchParams: {
    page: string;
    limit: string;
  };
}

export default async function InmueblesPage({ searchParams }: Props) {
  const page = +searchParams.page || 1;
  const limit = +searchParams.limit || 25;

  const { docs, totalPages, totalDocs } = await generalService.getInmuebles({
    page,
    limit,
  });

  return (
    <main className="flex flex-col gap-3 items-center justify-center min-h-screen p-10">
      <h1 className="text-left">Inmuebles Spider</h1>
      <InmueblesTable
        inmuebles={docs}
        page={page ?? 1}
        totalPages={totalPages}
        totalInmuebles={totalDocs}
        limit={limit}
      />
    </main>
  );
}
