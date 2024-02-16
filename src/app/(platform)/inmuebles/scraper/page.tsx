import { redirect } from "next/navigation";

import { generalService } from "@/service";
import { links } from "@/constants";
import { revalidatePath } from "next/cache";

export default async function CouponsScraperPage() {
  await generalService.scrappingData({
    linkParams: links[1].value,
    page: "Pita Ibiza",
  });
  
  revalidatePath("/inmuebles");
  redirect("/inmuebles");
}
