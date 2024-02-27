"use client";

import { Card, Button, Input } from "@nextui-org/react";
import { IoKeyOutline, IoMailOutline } from "react-icons/io5";
import { useBoolean } from "usehooks-ts";
import { motion } from "framer-motion";

import { PasswordInput } from "@/components";
import { slideInFromTop } from "@/utils";

export const LoginForm = () => {
  const { value: passwordIsVisible, toggle: togglePasswordVisibility } =
    useBoolean(false);

  return (
    <motion.div variants={slideInFromTop} initial="hidden" animate="visible" className="w-full max-w-[500px]">
      <Card className="px-5 py-5">
        <form className="flex flex-col gap-5">
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
          />
          {/* <Divider className="bg" /> */}
          <Button variant="flat">Entrar</Button>
        </form>
      </Card>
    </motion.div>
  );
};
