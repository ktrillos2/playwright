import { InmueblesTable } from "@/modules";
import { generalService } from "@/service";

export default async function InmueblesPage() {
  const { docs } = await generalService.getInmuebles();
  return (
    <main className="flex flex-col gap-3 items-center justify-center min-h-screen p-10">
      <InmueblesTable inmuebles={docs} />
    </main>
  );
}
