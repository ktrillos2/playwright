import { couponActions } from "@/actions";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const SelectLayout = dynamic(
  () => import("../../../../modules/coupons/coupon-editor/SelectLayout"),
  {
    loading: () => <p></p>,
    ssr: false,
  }
);

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
      {/* <pre>{JSON.stringify(coupon, null, 2)}</pre> */}
      <SelectLayout coupon={coupon} />
    </div>
  );
}
