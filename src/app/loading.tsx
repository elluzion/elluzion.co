"use client";

import BarLoader from "react-spinners/BarLoader";

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-contentDvh font-mono text-muted-foreground">
      <BarLoader color="#fff" speedMultiplier={0.7} height={2} />
    </div>
  );
}
