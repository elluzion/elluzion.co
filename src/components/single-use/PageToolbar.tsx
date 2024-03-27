"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { createClient } from "@/lib/supabase/client";
import { pascalCase } from "@/lib/utils";
import { mdiToolbox } from "@mdi/js";
import Icon from "@mdi/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../button";
import LogOutButton from "./LogOutButton";

export default function PageToolbar() {
  const path = usePathname();
  const pathArray = path.split("/");

  const [logoutButtonVisible, setLogoutButtonVisible] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    try {
      supabase.auth.getUser().then((res) => {
        if (res.data.user) setLogoutButtonVisible(true);
      });
    } catch (e) {}
  });

  const formatUrlSection = (item: string) => {
    return item
      .split("-") // separate into array
      .map((word) => (word = pascalCase(word))) // format each word
      .join(" "); /* combine back together */
  };

  return (
    <div className="z-50 fixed flex justify-center items-center bg-zinc-950 bg-opacity-80 backdrop-blur-[120px] w-full h-16">
      <div className="flex justify-normal items-center gap-2 px-4 md:px-0 w-full max-w-[768px]">
        <Link href="/">
          <Image
            src="/icons/elluzion_small_icon.svg"
            alt="icon"
            width={40}
            height={40}
            className="hover:bg-accent p-2.5 rounded-md w-10 h-10 transition-colors"
          />
        </Link>
        <Breadcrumb className="ml-2">
          <BreadcrumbList>
            {pathArray.map((item, key) => {
              // dont create an element for the first item of the array as its empty
              if (item == "") return;
              // path to the subfolder
              const subPath = pathArray.slice(0, key + 1).join("/");
              if (subPath != pathArray.join("/")) {
                return (
                  <div
                    key={key}
                    className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-muted-foreground text-sm break-words"
                  >
                    <BreadcrumbItem key={key}>
                      <BreadcrumbLink href={subPath} className="font-medium">
                        {formatUrlSection(item)}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </div>
                );
              } else {
                return (
                  <BreadcrumbItem key={key}>
                    <BreadcrumbPage className="font-medium">
                      {formatUrlSection(item)}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                );
              }
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <span className="grow"></span>
        {/* TOOLS BUTTON */}
        {path != "/tools" && (
          <Link href={"/tools"}>
            <Button variant={"outline"} size="icon">
              <Icon size={0.75} path={mdiToolbox} />
            </Button>
          </Link>
        )}
        {logoutButtonVisible && <LogOutButton />}
      </div>
    </div>
  );
}
