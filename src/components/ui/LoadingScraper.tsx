"use client";
import Lottie from "lottie-react";
import loadingAnimation from "../../../public/lottie/loading.json";

interface Props {
  text: string;
}

export const LoadingScraper: React.FC<Props> = ({ text }) => {
  return (
    <div className="grid place-items-center mt-10">
      <p>{text}</p>
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        className="max-w-1/2"
      />
    </div>
  );
};
