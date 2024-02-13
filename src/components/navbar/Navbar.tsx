import {
  Navbar as NavbarNextUI,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";

import { FaSpider } from "react-icons/fa";

import { NavItem } from "./NavItem";
import { Info, PagePaths } from "@/enums";
import Link from "next/link";

const PAGES = [
  {
    path: PagePaths.INMUEBLES,
    name: "Inmuebles",
  },
  {
    path: PagePaths.COUPONS,
    name: "Cupones",
  },
];

export const Navbar = () => {
  return (
    <NavbarNextUI>
      <NavbarBrand className="gap-2" as={Link} href={"/"}>
        <FaSpider size={25} />
        <p className="font-bold text-inherit">{Info.TITLE}</p>
      </NavbarBrand>

      <NavbarContent
        className="gap-4"
        // className="hidden sm:flex gap-4"
        justify="center"
      >
        {PAGES.map((page) => (
          <NavItem key={page.name} {...page} />
        ))}
      </NavbarContent>
    </NavbarNextUI>
  );
};
