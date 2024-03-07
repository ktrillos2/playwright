"use client";

import { regex } from "@/constants";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Input,
  Link,
} from "@nextui-org/react";
import React, { useState } from "react";
import { IoIosImages } from "react-icons/io";
import {
  RegisterOptions,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";

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
  [FieldsForm.IMAGE]: { required: "La imagen del comercio es requerida" },
};

export const CommerceForm = () => {
  const form = useForm<IForm>({});

  const {
    handleSubmit,
    watch,
    setError,
    setValue,
    clearErrors,
    reset,
    register,
    formState: { isValid, errors },
  } = form;

  const image = watch(FieldsForm.IMAGE);
  const name = watch(FieldsForm.NAME);
  const url = watch(FieldsForm.URL);

  const onSubmit: SubmitHandler<IForm> = async () => {};

  return (
    <div className="w-full flex flex-col sm:flex-row gap-2">
      <Card className="w-full">
        <CardHeader className="pb-0 pt-4 px-4 lg:px-8 flex-col items-start">
          <h4 className="font-bold text-large">Crear comercio</h4>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full lg:py-4 lg:px-8 grid gap-2"
          >
            <Input
              type="text"
              label={"Nombre del comercio"}
              {...register(FieldsForm.NAME, validationForm[FieldsForm.NAME])}
              isInvalid={!!errors[FieldsForm.NAME]}
              errorMessage={errors[FieldsForm.NAME]?.message}
            />
            <Input
              type="url"
              label={"Página del comercio"}
              {...register(FieldsForm.URL, validationForm[FieldsForm.URL])}
              isInvalid={!!errors[FieldsForm.URL]}
              errorMessage={errors[FieldsForm.URL]?.message}
            />

            <Input
              type="url"
              label={"Logo del comercio"}
              {...register(FieldsForm.IMAGE, validationForm[FieldsForm.IMAGE])}
              isInvalid={!!errors[FieldsForm.IMAGE]}
              errorMessage={errors[FieldsForm.IMAGE]?.message}
            />
          </form>
        </CardBody>
      </Card>
      <div>
        <Card isFooterBlurred radius="lg" className="border-none">
          <div className="w-[200px] h-[200px] grid place-content-center bg-gradient-to-tl from-green-300 via-blue-500 to-purple-600">
            {image && !errors[FieldsForm.IMAGE] ? (
              <Image
                alt="Commerce image"
                className="object-cover"
                height={200}
                src={image}
                width={200}
              />
            ) : (
              <IoIosImages size={160} />
            )}
          </div>

          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">{name || "Nombre"}</p>
            <Button
              className="text-tiny text-white bg-black/20"
              variant="flat"
              color="default"
              radius="lg"
              size="sm"
              as={Link}
              href={url}
              isDisabled={!url && !!errors[FieldsForm.URL]}
            >
              Ver más
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
