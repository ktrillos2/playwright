"use client";

import { regex } from "@/constants";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Input,
  Link,
} from "@nextui-org/react";
import React from "react";
import confetti from "canvas-confetti";
import { IoIosImages } from "react-icons/io";

import { RegisterOptions, SubmitHandler, useForm } from "react-hook-form";
import { commerceActions } from "@/actions";
import toast from "react-hot-toast";
import { useBoolean } from "usehooks-ts";
import { CardCommerce } from "../CardCommerce";
import { motion } from "framer-motion";

export enum FieldsForm {
  NAME = "name",
  URL = "url",
  QUERIES = "queries",
  IMAGE = "image",
}
export interface IForm {
  [FieldsForm.NAME]: string;
  [FieldsForm.URL]: string;
  [FieldsForm.QUERIES]: string;
  [FieldsForm.IMAGE]: string;
}

const validationForm: Record<string, RegisterOptions> = {
  [FieldsForm.NAME]: { required: "El nombre del comercio es requerido" },
  [FieldsForm.URL]: {
    required: "La url del comercio es requerida",
    pattern: {
      value: regex.url,
      message: "El enlace no es válido",
    },
  },
  [FieldsForm.IMAGE]: {
    required: "La imagen del comercio es requerida",
    pattern: {
      value: regex.url,
      message: "El enlace de la imagen no es válido",
    },
  },
};

const handleConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

export const CommerceForm = () => {
  const {
    value: isLoading,
    setTrue: setIsLoadingTrue,
    setFalse: setIsLoadingFalse,
  } = useBoolean(false);

  const {
    value: created,
    setTrue: setCreatedTrue,
    setFalse: setCreatedFalse,
  } = useBoolean(false);

  const {
    value: isCategoriesForm,
    setTrue: setIsCategoriesFormTrue,
    setFalse: setIsCategoriesFormFalse,
  } = useBoolean(false);

  const form = useForm<IForm>({});

  const {
    handleSubmit,
    watch,
    register,
    formState: { isValid, errors },
  } = form;

  const image = watch(FieldsForm.IMAGE);
  const name = watch(FieldsForm.NAME);
  const url = watch(FieldsForm.URL);

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    try {
      setIsLoadingTrue();
      await commerceActions.createCommerce(data);
      toast.success("Comercio creado correctamente");
      setCreatedTrue();
      handleConfetti();
    } catch (error: any) {
      toast.error("Ocurrió un error al crear el comercio: " + error.message);
    } finally {
      setIsLoadingFalse();
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row gap-2">
      {created && !isCategoriesForm ? (
        <Card className="w-full max-w-[650px] mx-auto">
          <CardHeader className="pb-0 pt-4 px-4 flex-col">
            <h3 className="font-bold text-3xl text-success">
              Comercio creado con éxito 🎉
            </h3>
          </CardHeader>
          <CardBody className="grid gap-4">
            <div className="mx-auto grid place-content-center my-[50px]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                  },
                  scale: [1, 1.6, 1.5],
                }}
              >
                <CardCommerce
                  url={url}
                  image={image}
                  name={name}
                  showImage={!!image && !errors[FieldsForm.IMAGE]}
                  validUrl={!url || !!errors[FieldsForm.URL]}
                />
              </motion.div>
            </div>
            <Divider />
            <div className="w-full flex max-md:flex-col gap-2 justify-center">
              <Button as={Link} href="/commerces">
                Ver comercios
              </Button>
              <Button onClick={setIsCategoriesFormTrue}>
                Agregar categorías
              </Button>
              <Button onClick={setCreatedFalse}>Crear otro comercio</Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="w-full max-w-[600px] mx-auto">
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <h3 className="font-bold text-xl">Crear comercio</h3>
          </CardHeader>
          <CardBody>
            <Divider />

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
              <div className="flex gap-4">
                <div className="grid gap-4 flex-1">
                  <Input
                    isRequired
                    type="text"
                    label={"Nombre del comercio"}
                    {...register(
                      FieldsForm.NAME,
                      validationForm[FieldsForm.NAME]
                    )}
                    isInvalid={!!errors[FieldsForm.NAME]}
                    errorMessage={errors[FieldsForm.NAME]?.message}
                  />
                  <Input
                    isRequired
                    type="url"
                    label={"Página del comercio"}
                    {...register(
                      FieldsForm.URL,
                      validationForm[FieldsForm.URL]
                    )}
                    isInvalid={!!errors[FieldsForm.URL]}
                    errorMessage={errors[FieldsForm.URL]?.message}
                  />

                  <Input
                    isRequired
                    type="url"
                    label={"Logo del comercio"}
                    {...register(
                      FieldsForm.IMAGE,
                      validationForm[FieldsForm.IMAGE]
                    )}
                    isInvalid={!!errors[FieldsForm.IMAGE]}
                    errorMessage={errors[FieldsForm.IMAGE]?.message}
                  />
                </div>

                <div className="hidden md:block">
                  <CardCommerce
                    url={url}
                    image={image}
                    name={name}
                    showImage={!!image && !errors[FieldsForm.IMAGE]}
                    validUrl={!url || !!errors[FieldsForm.URL]}
                  />
                </div>
              </div>

              <Input
                type="text"
                label={"Queries (opcional)"}
                {...register(
                  FieldsForm.QUERIES,
                  validationForm[FieldsForm.QUERIES]
                )}
                isInvalid={!!errors[FieldsForm.QUERIES]}
                errorMessage={errors[FieldsForm.QUERIES]?.message}
                description={
                  "Ingresa las queries usadas por el comercio para mejorar el ordenamiento y la calidad de data"
                }
              />

              <Divider />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  color="success"
                  isDisabled={!isValid}
                  className="w-full md:w-auto"
                >
                  Crear comercio
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
