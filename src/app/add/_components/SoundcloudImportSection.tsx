import { Button } from "@/components/button";
import { FormItem, FormLabel } from "@/components/form";
import { Input } from "@/components/input";
import { mdiImport } from "@mdi/js";
import Icon from "@mdi/react";
import { useRef, useState } from "react";

export default function SoundcloudImportSection(props: {
  show: boolean;
  handleSoundcloudImport: (songUrl: string) => Promise<boolean>;
}) {
  // refs
  const songImportInputRef = useRef<HTMLInputElement | null>(null);
  const [show, setShow] = useState(props.show);

  function handleImportSong() {
    const songUrl = songImportInputRef.current?.value || "";
    if (!songUrl.startsWith("https://")) {
      return;
    }
    // depending on the result of the import, hide this section
    props.handleSoundcloudImport(songUrl).then((success) => setShow(!success));
  }

  return (
    <FormItem style={{ display: show ? "block" : "none" }}>
      <FormLabel>Import from Soundcloud</FormLabel>
      <div className="flex gap-2">
        <Input
          ref={songImportInputRef}
          className="bg-popover w-auto grow"
          placeholder="Enter Soundcloud URL"
          type="url"
        />
        <Button type="button" size={"icon"} onClick={handleImportSong}>
          <Icon size={0.75} path={mdiImport} />
        </Button>
      </div>
    </FormItem>
  );
}
