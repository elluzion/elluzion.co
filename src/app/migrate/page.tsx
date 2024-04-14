"use client";

import { Button } from "@/components/button";
import { migrate } from "./actions";

export default function Migrate() {
  function handleMigrate() {
    migrate();
  }
  return <Button onClick={handleMigrate}>migrate</Button>;
}
