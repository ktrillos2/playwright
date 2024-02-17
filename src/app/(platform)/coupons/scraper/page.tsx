import { redirect } from "next/navigation";

import { generalService } from "@/service";
import { links } from "@/constants";
import { revalidatePath } from "next/cache";

export default async function CouponsScraperPage() {
  await generalService.scrappingData({
    linkParams: links[0].value,
    page: "Exito",
  });

  revalidatePath("/coupons");
  redirect("/coupons");
}
