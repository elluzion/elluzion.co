"use client";

import { Button } from "@/components/ui/button";
import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/navigation";

export default function AddSongButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/music/add");
  };

  return (
    <Button onClick={handleClick}>
      <Icon path={mdiPlus} size={0.75} /> Add song
    </Button>
  );
}
