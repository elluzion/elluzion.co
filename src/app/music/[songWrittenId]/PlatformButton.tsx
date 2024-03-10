import { Button } from "@/components/ui/button";
import React from "react";

import { Platforms } from "@/lib/songs/platforms";
import { SiSpotify } from "@icons-pack/react-simple-icons";

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
  const name = platformData?.name || "Generic";
  const icon = platformData?.icon || <SiSpotify />;

  return (
    <Button
      className={`h-14 w-full text-white flex gap-2 text-md`}
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
