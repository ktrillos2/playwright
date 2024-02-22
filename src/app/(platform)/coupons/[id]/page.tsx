import { couponActions } from "@/actions";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const CouponImageEditor = dynamic(
  () => import("../../../../modules/coupons/coupon-editor/CouponImageEditor"),
  {
    loading: () => <p>Loading...</p>,
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
      <CouponImageEditor coupon={coupon} />
    </div>
  );
}
