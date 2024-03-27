import { Badge } from "@/components/badge";

export function AddSongHeader(props: {
  editing?: string;
  index: number;
  indexMax: number;
}) {
  return (
    <div className="flex flex-col justify-end gap-4 mb-3 h-16">
      <div className="flex justify-between items-end">
        <h1 className="font-bold text-3xl">
          {props.editing ? "Edit" : "Add"} Song
        </h1>
        <Badge variant={"secondary"}>
          {props.index + 1} / {props.indexMax + 1}
        </Badge>
      </div>
    </div>
  );
}
