"use client";

import { useCopyToClipboard } from "usehooks-ts";

import { Button } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";

interface Props {
  content: string;
}

export const CopyClipboardButton: React.FC<Props> = ({ content }) => {
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = async () => {
    try {
      await copy(content);
      toast.success("Copiado al portapapeles");
    } catch (error) {
      toast.error("No se ha podido copiar al portapapeles");
    }
  };

  return (
    <Button onClick={handleCopy} color="success">
      <FaRegCopy size={16} className="text-white" />
    </Button>
  );
};
