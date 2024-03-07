"use client";

import { usePathname } from "next/navigation";

import { Button } from "../button";

import Link from "next/link";
import Image from "next/image";

export default function PageHeader() {
  const path = usePathname();
  const pathArray = path.split("/");
  return (
    <div className="fixed flex justify-center items-center bg-zinc-950 bg-opacity-50 backdrop-blur-2xl w-full h-16">
      <div className="flex justify-normal items-center gap-4 px-4 md:px-0 w-full max-w-[700px]">
        <Link href="/">
          <Image
            src="/icons/elluzion_small_icon.svg"
            alt="icon"
            width={40}
            height={40}
            className="hover:bg-accent p-2.5 rounded-md w-10 h-10 transition-colors"
          />
        </Link>

        {path == "/" ? (
          <div className="flex gap-2 rounded-lg">
            <Link href={"/music"}>
              <Button variant={"outline"} className="bg-transparent">
                Music
              </Button>
            </Link>
            <Link href={"/projects"}>
              <Button variant={"outline"} className="bg-transparent">
                Projects
              </Button>
            </Link>
          </div>
        ) : (
          <span>{">"}</span>
        )}
        <div className="flex gap-2">
          {pathArray.map((item, key) => {
            // dont create an element for the first item of the array as its empty
            if (item == "") return;
            // path to the subfolder
            const subPath = pathArray.slice(0, key + 1).join("/");
            return (
              <div key={key} className="flex items-center gap-2">
                {/* subfolder item */}
                <Link href={subPath}>
                  <Button variant={"outline"} className="bg-transparent">
                    {item[0].toUpperCase() + item.slice(1)}
                  </Button>
                </Link>
                {/* path separator */}
                {key != pathArray.length - 1 ? <span>/</span> : ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
