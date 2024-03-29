import { Input } from "@/components/input";
import { useToast } from "@/components/use-toast";
import { mdiRefresh, mdiUpload } from "@mdi/js";
import Icon from "@mdi/react";
import { useRef } from "react";
import { ALLOWED_FILE_TYPES } from "../analyzer-screen";

export default function FileUploadInput(props: {
  isLoading: boolean;
  onFileSubmitted: (file: File) => void;
}) {
  // element over the file input
  const uploadOverlayRef = useRef<HTMLLabelElement>(null);
  const { toast } = useToast();

  // type validation when file has been selected
  function handleSubmit(file: File) {
    // file input is empty
    if (!file) return;

    // error: file type invalid
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "File type not allowed!",
        description: `File has to be of type ${ALLOWED_FILE_TYPES.join(", ")}`,
      });
      return;
    }

    // all correct
    props.onFileSubmitted(file);
  }

  function handleInputHoverOn() {
    uploadOverlayRef.current?.classList.add(
      "!ring-2",
      "!ring-ring",
      "!ring-offset-2",
      "!bg-opacity-5"
    );
  }

  function handleInputHoverOff() {
    uploadOverlayRef.current?.classList.remove(
      "!ring-2",
      "!ring-ring",
      "!ring-offset-2",
      "!bg-opacity-5"
    );
  }

  return (
    <div className="h-28">
      <label
        ref={uploadOverlayRef}
        htmlFor="fileUpload"
        className="flex flex-col justify-center items-center gap-4 bg-white bg-opacity-0 p-6 ring-border rounded-lg w-full h-28 text-center transition-all ring-1"
      >
        <div className="flex justify-center items-center gap-2 font-semibold">
          <Icon path={props.isLoading ? mdiRefresh : mdiUpload} size={1} />
          <span>{props.isLoading ? "Analyzing" : "Upload file"}</span>
        </div>
        <span className="w-full font-mono text-muted-foreground text-sm truncate">
          {props.isLoading
            ? "This will take a few seconds"
            : ALLOWED_FILE_TYPES.join(", ")}
        </span>
      </label>
      {/* ACTUAL INPUT - HIDDEN */}
      <Input
        id="fileUpload"
        type="file"
        accept=".mp3,.wav,.flac"
        className="opacity-0 w-full h-28 -translate-y-28 cursor-pointer"
        onMouseEnter={handleInputHoverOn}
        onMouseLeave={handleInputHoverOff}
        onDragEnter={handleInputHoverOn}
        onDragLeave={handleInputHoverOff}
        onDrop={() => {
          setTimeout(handleInputHoverOff, 500);
        }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleSubmit(e.target.files[0]);
          }
        }}
        required
      />
    </div>
  );
}
