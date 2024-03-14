import { notFound } from "next/navigation";

import { commerceActions } from "@/actions";
import { CommerceForm } from "@/modules";

interface Props {
  params: {
    slug: string;
  };
}

export default async function CommerceEditPage({ params: { slug } }: Props) {
  const commerce = await commerceActions.getCommerceBySlug(slug);

  if (!commerce) notFound();

  return <CommerceForm commerce={commerce} isEditForm />;
}
