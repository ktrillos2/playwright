"use client";

import Link from "next/link";
import {
  Navbar as NavbarNextUI,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  User,
} from "@nextui-org/react";
import {
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";

import { FaSpider } from "react-icons/fa";

import { NavItem } from "./NavItem";
import { Info, PagePaths } from "@/enums";
import { useSession } from "next-auth/react";
import { IUser } from "../../../nextauth";

const PAGES = [
  {
    path: PagePaths.INMUEBLES,
    name: "Inmuebles",
  },
  {
    path: PagePaths.COUPONS,
    name: "Cupones",
  },
  {
    path: PagePaths.COMMERCES,
    name: "Comercios",
  },
];

export const Navbar = () => {
  const { data: session, status } = useSession();

  const user: IUser = session?.user as any;

  return (
    <NavbarNextUI>
      <NavbarBrand className="gap-2" as={Link} href={PagePaths.HOME}>
        <FaSpider size={25} />
        <p className="font-bold text-inherit">{Info.TITLE}</p>
      </NavbarBrand>

      <NavbarContent className="gap-4" justify="center">
        {PAGES.map((page) => (
          <NavItem key={page.name} {...page} />
        ))}
      </NavbarContent>
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
