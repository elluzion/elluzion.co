"use client";

import { Button } from "@/components/ui/button";
import React from "react";

import { Platforms } from "@/lib/songs/platforms";

import { pascalCase } from "@/lib/utils";

import Icon from "@mdi/react";
import { mdiPlay } from "@mdi/js";

import { motion } from "framer-motion";

interface PlatformButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  platform: string | null;
  entry: number;
}
export const PlatformButton = React.forwardRef<
  HTMLButtonElement,
  PlatformButtonProps
>(({ className, platform, entry, ...props }, ref) => {
  const platformData = Platforms.find((x) => x.id == platform);

  const accent = platformData?.accentColour || "#242424";
  const name = platformData?.name || pascalCase(platform || "Play");
  const icon = platformData?.icon || <Icon path={mdiPlay} size={1.2} />;
  const darkForeground = platformData?.darkForeground || false;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 * entry } }}
      className="w-full h-14"
    >
      <Button
        className={`h-14 w-full flex gap-2 text-md hover:scale-[.98] transition-[transform,filter] hover:brightness-110 ${
          darkForeground ? "text-zinc-950" : "text-white"
        }`}
        style={{
          backgroundColor: accent,
        }}
      >
        {icon}
        {name}
      </Button>
    </motion.div>
  );
});
PlatformButton.displayName = "PlatformButton";
