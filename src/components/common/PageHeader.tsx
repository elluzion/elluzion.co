"use client";

import { ReactNode } from "react";
import Image from "next/image";
import headerLogo from "/public/images/header_logo.svg";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./DarkModeToggle";
import Link from "next/link";

const NavMenuItem: React.FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent className="p-4 w-">
        <div className="w-80">{children}</div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default function PageHeader() {
  return (
    <div className="w-full h-16 fixed border-b-2 border-border flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 bg-opacity-10 dark:bg-opacity-50 backdrop-blur-2xl ">
      <div className="px-4 lg:px-16 w-full flex items-center justify-between md:justify-normal gap-8 xl:w-[1128px] xl:px-0">
        <Image
          src={headerLogo}
          alt="elluzion"
          className="h-4 md:h-6 w-min invert dark:invert-0"
        />
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="text-muted-foreground">
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavMenuItem title="Projects">
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavMenuItem>
            <NavMenuItem title="Music">
              <NavigationMenuLink>Music</NavigationMenuLink>
            </NavMenuItem>
            <NavMenuItem title="Connect">
              <div className="w-80 grid grid-cols-2 gap-2">
                <div className="rounded h-12 bg-red-900"></div>
                <div className="rounded h-12 bg-green-900"></div>
                <div className="rounded h-12 bg-blue-900"></div>
                <div className="rounded h-12 bg-yellow-900"></div>
              </div>
            </NavMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="w-full flex justify-end">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
