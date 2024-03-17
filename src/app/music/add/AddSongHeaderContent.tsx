import { Badge } from "@/components/ui/badge";
import React from "react";

export function AddSongHeaderSection(props: {
  index: number;
  indexMax: number;
}) {
  return (
    <div className="prose-invert prose">
      <div className="flex justify-between items-end">
        <h1 className="mb-3 font-bold">Add Song</h1>
        <Badge className="mb-3" variant={"secondary"}>
          {props.index + 1} / {props.indexMax + 1}
        </Badge>
      </div>
    </div>
  );
}