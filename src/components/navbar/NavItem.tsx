"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Link as LinkNextUI,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/react";

import { PagePaths } from "@/enums";

interface Props {
  path: PagePaths;
  name: string;
  closeMenu: () => void;
}

export const NavItem: React.FC<Props> = ({ name, path, closeMenu }) => {
  const pathname = usePathname();
  const href = `/${path}`;
  const isActive = pathname === `/${path}`;
  const color = isActive ? "secondary" : "foreground";

  return (
    <NavbarMenuItem className="w-[980px] mx-auto">
      <LinkNextUI as={Link} color={color} className="w-full" href={href} onClick={closeMenu}>
        {name}
      </LinkNextUI>
    </NavbarMenuItem>
  );
};
