import { Button } from "@/components/ui/button";
import React from "react";

import { Platforms } from "@/lib/songs/platforms";
import { SiSpotify } from "@icons-pack/react-simple-icons";

import { pascalCase } from "@/lib/utils";

import Icon from "@mdi/react";
import { mdiPlay } from "@mdi/js";

interface PlatformButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  platform: string | null;
}

export const PlatformButton = React.forwardRef<
  HTMLButtonElement,
  PlatformButtonProps
>(({ className, platform, ...props }, ref) => {
  const platformData = Platforms.find((x) => x.id == platform);

  const accent = platformData?.accentColour || "#242424";
  const name = platformData?.name || pascalCase(platform || "Play");
  const icon = platformData?.icon || <Icon path={mdiPlay} size={1.2} />;
  const darkForeground = platformData?.darkForeground || false;

  return (
    <Button
      className={`h-14 w-full flex gap-2 text-md ${
        darkForeground ? "text-zinc-950" : "text-white"
      }`}
      style={{
        backgroundColor: accent,
      }}
    >
      {icon}
      {name}
    </Button>
  );
});
PlatformButton.displayName = "PlatformButton";
