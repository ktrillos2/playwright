"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Link as LinkNextUI, NavbarItem } from "@nextui-org/react";

import { PagePaths } from "@/enums";

interface Props {
  path: PagePaths;
  name: string;
}

export const NavItem: React.FC<Props> = ({ name, path }) => {
  const pathname = usePathname();

  const isActive = pathname === path;
  const color = isActive ? "secondary" : "foreground";

  return (
    <NavbarItem>
      <LinkNextUI as={Link} color={color} href={path}>
        {name}
      </LinkNextUI>
    </NavbarItem>
  );
};
