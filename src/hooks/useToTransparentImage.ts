"use client";
import { useEffect, useState } from "react";

import { removeBackground } from "@/helpers";
import toast from "react-hot-toast";

export const useToTransparentImage = (originalImage: string) => {
  const [displayImage, setDisplayImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const convertImage = async () => {
      setDisplayImage(null);
      setIsLoading(true);
      try {
        const response = await removeBackground(originalImage);
        setDisplayImage(response);
      } catch (error) {
        console.log({ error })
      } finally {
        setIsLoading(false);
      }
    };

    convertImage();
  }, [originalImage]);

  return { displayImage, isLoading };
};
