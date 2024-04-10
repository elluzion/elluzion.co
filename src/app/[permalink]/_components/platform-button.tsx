"use client";

import { Button } from "@/components/button";
import { PlatformItem, Platforms } from "@/lib/songs/platforms";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface PlatformButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  url: string;
  entry: number;
}
export const PlatformButton = React.forwardRef<
  HTMLButtonElement,
  PlatformButtonProps
>(({ className, url, entry, ...props }, ref) => {
  const [data, setData] = useState<PlatformItem | null>(null);
  useEffect(() => {
    setData(Platforms.resolve(url));
  }, [url]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, translateY: "-16px" }}
      animate={{
        opacity: 1,
        scale: 1,
        translateY: "0px",
        transition: { delay: 0.07 * entry },
      }}
      className="w-full h-14"
    >
      <Button
        className={`h-14 w-full flex gap-2 text-md hover:scale-[.98] transition-[transform,filter] hover:brightness-110 ${
          data?.darkForeground ? "text-zinc-950" : "text-white"
        }`}
        style={{
          backgroundColor: data?.accentColour,
        }}
      >
        {data?.icon}
        {data?.name}
      </Button>
    </motion.div>
  );
});
PlatformButton.displayName = "PlatformButton";
