import { Badge } from "@/components/badge";
import { useSongFormContext } from "../context";

export default function SongFormHeader() {
  const context = useSongFormContext();

  return (
    <div className="flex flex-col justify-end gap-4 mb-3 h-16">
      <div className="flex justify-between items-end">
        <h1 className="font-bold text-3xl">{context.editing.is ? "Edit" : "Add"} Song</h1>
        <Badge variant={"secondary"}>
          {context.index.current + 1} / {context.index.max + 1}
        </Badge>
      </div>
    </div>
  );
}
