import { LoggerComponent } from "@/components";
import { CouponsScraperTable } from "@/modules";
import { generalService } from "@/service";

export default async function CouponsScraperPage() {
  
  const messages = await generalService.getLogMessagesByCategory("COUPON");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CouponsScraperTable />
      <LoggerComponent messages={messages} />
    </div>
  );
}
