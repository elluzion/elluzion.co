"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortInfo,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Button } from "../button";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";

export default function PageHeader() {
  return (
    <div className="fixed flex justify-center items-center bg-zinc-950 bg-opacity-50 backdrop-blur-2xl w-full h-16">
      <div className="flex justify-normal items-center gap-4 px-4 md:px-0 w-full max-w-[700px]">
        {usePathname() != "/" ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              history.back();
            }}
          >
            <ChevronLeftIcon />
          </Button>
        ) : (
          <Link href="/">
            <Image
              src="icons/elluzion_small_icon.svg"
              alt="icon"
              width={24}
              height={18}
            />
          </Link>
        )}
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Projects</MenubarTrigger>
            <MenubarContent>
              <Link href="https://github.com/project-fluid " target="_blank">
                <MenubarItem>
                  Project Fluid <MenubarShortInfo>Deprecated</MenubarShortInfo>
                </MenubarItem>
              </Link>
              <MenubarSeparator />
              <Link href="https://github.com/elluzion" target="_blank">
                <MenubarItem>Check my GitHub</MenubarItem>
              </Link>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Music</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Tracks</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
}
