import { notFound } from "next/navigation";

import { categoryActions, commerceActions } from "@/actions";
import { CommerceForm } from "@/modules";

interface Props {
  params: {
    slug: string;
  };
}

export default async function CommerceEditPage({ params: { slug } }: Props) {
  const [commerce, categories] = await Promise.all([
    commerceActions.getCommerceBySlug(slug),
    categoryActions.getCategories(),
  ]);
  if (!commerce) notFound();

  return <CommerceForm commerce={commerce} isEditForm categories={categories} />;
}
