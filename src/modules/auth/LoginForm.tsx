"use client";

import { Card, Button, Input } from "@nextui-org/react";
import { IoKeyOutline, IoMailOutline } from "react-icons/io5";
import { useBoolean } from "usehooks-ts";
import { motion } from "framer-motion";
import { useForm, SubmitHandler, RegisterOptions } from "react-hook-form";

import { PasswordInput } from "@/components";
import { slideInFromTop } from "@/utils";
import { regex } from "@/constants";
import { login } from "@/actions";
import { signIn } from "next-auth/react";

enum FormKeys {
  USER = "user",
  PASSWORD = "password",
}

type FormData = {
  [FormKeys.USER]: string;
  [FormKeys.PASSWORD]: string;
};

interface Validator {
  [FormKeys.USER]: RegisterOptions<FormData, FormKeys.USER>;
  [FormKeys.PASSWORD]: RegisterOptions<FormData, FormKeys.PASSWORD>;
}

const validator: Validator = {
  [FormKeys.USER]: {
    required: { message: "El correo es obligatorio", value: true },
    pattern: {
      message: "No es un correo valido",
      value: regex.email,
    },
  },
  [FormKeys.PASSWORD]: {
    minLength: {
      message: "Debe tener más de 3 caracteres",
      value: 3,
    },
    maxLength: {
      message: "Debe tener menos de 16 caracteres",
      value: 16,
    },
    pattern: {
      message: "Debe contener letras y símbolos",
      value: regex.password,
    },
  },
};

interface Props {
  error?: string;
}

export const LoginForm: React.FC<Props> = ({ error }) => {
  const { value: passwordIsVisible, toggle: togglePasswordVisibility } =
    useBoolean(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { user, password } = data;
    try {
      await signIn("credentials", {
        user,
        password,
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <motion.div
      variants={slideInFromTop}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[500px]"
    >
      <Card className="px-5 py-5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>
          <Input
            fullWidth
            label={
              <span className="flex items-center gap-2">
                <IoMailOutline /> Correo electrónico
              </span>
            }
            type="email"
            variant="underlined"
            autoComplete="email"
            errorMessage={errors[FormKeys.USER]?.message}
            {...register(FormKeys.USER, validator[FormKeys.USER])}
          />
          <PasswordInput
            fullWidth
            label={
              <span className="flex items-center gap-2">
                <IoKeyOutline /> Contraseña
              </span>
            }
            isVisible={passwordIsVisible}
            toggleVisibility={togglePasswordVisibility}
            variant="underlined"
            errorMessage={errors[FormKeys.PASSWORD]?.message}
            register={register(FormKeys.PASSWORD, validator[FormKeys.PASSWORD])}
            autoComplete="current-password"
          />
          <LoginButton isValid={isValid} />
          {error ? (
            <span className="text-danger text-xs">
              No se pudo iniciar sesión, revisa las credenciales
            </span>
          ) : null}
        </form>
      </Card>
    </motion.div>
  );
};

interface ButtonProps {
  isValid: boolean;
}

const LoginButton: React.FC<ButtonProps> = ({ isValid }) => {
  // const { pending } = useFormStatus();
  return (
    <Button isDisabled={!isValid} type="submit" variant="flat">
      Entrar
    </Button>
  );
};
