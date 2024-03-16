"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Navbar as NavbarNextUI,
  NavbarBrand,
  NavbarContent,
  User,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/react";
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/react";
import { useBoolean } from "usehooks-ts";

import { FaSpider } from "react-icons/fa";

import { NavItem } from "./NavItem";

import { Info, PagePaths } from "@/enums";

import { IUser } from "../../../nextauth";

const PAGES = [
  {
    path: PagePaths.INMUEBLES,
    name: "Inmuebles",
  },
  {
    path: PagePaths.COUPONS,
    name: "Tabla de cupones",
  },
  {
    path: PagePaths.COUPONS_SCRAPER,
    name: "Scrapear cupones",
  },
  {
    path: PagePaths.COMMERCES,
    name: "Comercios",
  },
  {
    path: PagePaths.CREATE_COMMERCE,
    name: "Crear comercio",
  },
];

export const Navbar = () => {
  const {
    value: isMenuOpen,
    toggle: toggleMenu,
    setValue: setIsMenuOpen,
    setFalse: closeMenu,
  } = useBoolean(false);

  const { data: session, status } = useSession();

  const user: IUser = session?.user as any;

  return (
    <NavbarNextUI isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent justify="start">
        <NavbarMenuToggle
          onClick={toggleMenu}
          aria-label={true ? "Close menu" : "Open menu"}
        />
        <NavbarBrand className="gap-2" as={Link} href={PagePaths.HOME}>
          <FaSpider size={25} />
          <p className="font-bold text-inherit">{Info.TITLE}</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarMenu className="overflow-hidden">
        {PAGES.map((page) => (
          <NavItem key={page.name} closeMenu={closeMenu} {...page} />
        ))}
      </NavbarMenu>

      <NavbarContent justify="end">
        {status === "authenticated" ? (
          <Dropdown placement="bottom-start" backdrop="blur">
            <DropdownTrigger>
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  src: user.image || "/user-logo.png",
                }}
                className="transition-transform gap-3"
                description={user.email}
                name={user?.full_name}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem
                as={Link}
                key="logout"
                color="danger"
                href="/api/auth/signout"
                className="text-danger"
              >
                Cerrar sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : null}
      </NavbarContent>
    </NavbarNextUI>
  );
};
