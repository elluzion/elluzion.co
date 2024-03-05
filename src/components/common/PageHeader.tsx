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

import { Button } from "../ui/button";
import { ChevronLeftIcon } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="w-full h-16 fixed flex items-center justify-center bg-zinc-950 bg-opacity-50 backdrop-blur-2xl ">
      <div className="px-4 md:px-0 w-full flex items-center justify-normal gap-4 max-w-[700px] ">
        {usePathname() != "/" ? (
          <Link href="/" legacyBehavior passHref>
            <Button size="icon" variant="ghost">
              <ChevronLeftIcon />
            </Button>
          </Link>
        ) : (
          ""
        )}
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Projects</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Project Fluid <MenubarShortInfo>Deprecated</MenubarShortInfo>
              </MenubarItem>
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
          <MenubarMenu>
            <MenubarTrigger>Connect</MenubarTrigger>
            <MenubarContent>
              <Link href="https://instagram.com/elluzion.music" target="_blank">
                <MenubarItem>Instagram</MenubarItem>
              </Link>
              <Link href="https://youtube.com/@elluzionmusic" target="_blank">
                <MenubarItem>YouTube</MenubarItem>
              </Link>
              <Link href="https://soundcloud.com/elluzionmusic" target="_blank">
                <MenubarItem>SoundCloud</MenubarItem>
              </Link>
              <Link
                href="https://open.spotify.com/artist/4OgioomMSaD1ier3lIfgzr"
                target="_blank"
              >
                <MenubarItem>Spotify</MenubarItem>
              </Link>
              <MenubarSeparator />
              <Link href="https://t.me/elluzion" target="_blank">
                <MenubarItem>Telegram</MenubarItem>
              </Link>
              <MenubarSeparator />
              <Link href="https://github.com/elluzion" target="_blank">
                <MenubarItem>GitHub</MenubarItem>
              </Link>
              <MenubarItem>
                Discord <MenubarShortInfo>@elluzion</MenubarShortInfo>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
}
