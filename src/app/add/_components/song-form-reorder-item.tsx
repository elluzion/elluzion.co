import { Button } from "@/components/button";
import { mdiDragHorizontalVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { Reorder, useDragControls } from "framer-motion";
import { XIcon } from "lucide-react";

export function SongFormReorderItem(props: {
  index: number;
  title: string;
  value: any;
  onRemove: (index: number) => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={props.value}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center gap-4 bg-popover py-2 pr-2 pl-4 rounded-lg"
    >
      <div className="cursor-grab" onPointerDown={(e) => dragControls.start(e)}>
        <Icon path={mdiDragHorizontalVariant} size={1} />
      </div>

      <span className="grow">{props.title}</span>
      <Button
        type="button"
        variant={"ghost"}
        size={"icon"}
        className="text-red-500"
        onClick={() => props.onRemove(props.index)}
      >
        <XIcon />
      </Button>
    </Reorder.Item>
  );
}
