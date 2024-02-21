import { couponActions } from "@/actions";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function CouponByIdPage({ params }: Props) {
  const { id } = params;

  const coupon = await couponActions.getCouponById(id);

  if (!coupon) notFound();

  return (
    <div>
      <h1>Hello Page</h1>
      <code>{JSON.stringify(coupon, null, 2)}</code>
    </div>
  );
}
