import React from "react";
import { Input, InputProps } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props extends InputProps {
  toggleVisibility: () => void;
  isVisible: boolean;
  register?: any;
}

export const PasswordInput: React.FC<Props> = ({
  toggleVisibility,
  isVisible,
  register = {},
  ...props
}) => {
  return (
    <Input
      endContent={
        <button
          className="focus:outline-none mr-1"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
          ) : (
            <FaEye className="text-xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      {...register}
      {...props}
    />
  );
};
