import Link from "next/link";
import {
  Navbar as NavbarNextUI,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";

import { FaSpider } from "react-icons/fa";

import { NavItem } from "./NavItem";
import { Info, PagePaths } from "@/enums";

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
      <NavbarBrand className="gap-2" as={Link} href={PagePaths.HOME}>
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
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="danger"
            href="/api/auth/signout"
            variant="flat"
          >
            Cerrar sesión
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NavbarNextUI>
  );
};
