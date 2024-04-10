import { Card, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";

interface Props {
  image: string;
  text: string;
  href: string;
}

export const CardImage: React.FC<Props> = ({ image, text, href }) => {
  return (
    <Card
      as={Link}
      href={`/${href}`}
      isFooterBlurred
      radius="lg"
      className="border-none cursor-pointer h-[320px]"
    >
      <Image
        isZoomed
        alt="NextUI Fruit Image with Zoom"
        src={image}
      />
      <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 h-10">
        <p className="text-lg font-bold text-white/80">{text}</p>
      </CardFooter>
    </Card>
  );
};
