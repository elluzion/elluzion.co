import { Button } from "@/components/button";
import { FormItem, FormLabel } from "@/components/form";
import { Input } from "@/components/input";
import { mdiImport } from "@mdi/js";
import Icon from "@mdi/react";
import { useRef, useState } from "react";

export default function SongFormImportSection(props: {
  show: boolean;
  handleSoundcloudImport: (songUrl: string) => Promise<boolean>;
}) {
  // refs
  const songImportUrl = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(props.show);

  function handleImportSong() {
    if (!songImportUrl.current) return;
    const songUrl = songImportUrl.current.value;
    if (!songUrl.startsWith("https://") || !songUrl.includes("soundcloud.com")) {
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
          ref={songImportUrl}
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
