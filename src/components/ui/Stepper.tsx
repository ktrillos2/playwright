"use client";

import { type FC } from "react";
import { motion } from "framer-motion";

interface Props {
  currentStep: number;
  steps: Steps[];
}

export interface Steps {
  label: string;
  step: number;
  icon: React.ReactElement;
}

export const Stepper: FC<Props> = ({ currentStep, steps }) => {
  return (
    <section className="mb-20 text-primary">
      <div className="mx-5 py-3 pr-10">
        <div className="p-4 relative flex items-center ">
          <div className="flex-auto border-t-1 border-gray absolute w-full">
            <motion.div
              className="absolute -top-0.5 left-0 w-full h-full border-t-4 border-primary"
              initial={{ scaleX: 0 }}
              animate={{
                scaleX:
                  currentStep <= steps.length
                    ? (currentStep - 1) / (steps.length - 1)
                    : 1,
              }}
              transition={{ duration: 0.5 }}
              style={{ transformOrigin: "left" }}
            ></motion.div>
          </div>
          <div className="flex items-center  justify-between w-full absolute">
            {steps.map(({ step, icon, label }) => (
              <div
                key={step}
                className={`flex items-center text-primary rounded-full transition-colors duration-1000 ${
                  currentStep > step ? "bg-primary" : "bg-white"
                }`}
              >
                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-primary">
                  {label}
                </div>
                <div className="relative h-10 w-10 flex justify-center items-center">
                  <i
                    className={`${
                      currentStep > step ? "text-white" : ""
                    } text-3xl absolute text-primary`}
                  >
                    {icon}
                  </i>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-primary progress-ring__circle stroke-current"
                      strokeWidth="3"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="48"
                      fill="transparent"
                      strokeDashoffset={currentStep >= step ? "0" : "300"}
                    ></circle>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
