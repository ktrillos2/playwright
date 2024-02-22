"use client";
import { useEffect, useState } from "react";

import { removeBackground } from "@/helpers";
import toast from "react-hot-toast";

export const useToTransparentImage = (originalImage: string) => {
  const [displayImage, setDisplayImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const id = "loadingId";
    toast.loading("Eliminando fondo a la imagen:...", { id });
    const convertImage = async () => {
      setDisplayImage(null);
      setIsLoading(true);
      try {
        const response = await removeBackground(originalImage);
        setDisplayImage(response);
        toast.success("Se ha eliminado el fondo correctamente");
      } catch (error) {
        toast.success("Ha ocurrido un error eliminando el fondo");
      } finally {
        setIsLoading(false);
        toast.remove(id);
      }
    };

    convertImage();
  }, [originalImage]);

  return { displayImage, isLoading };
};
