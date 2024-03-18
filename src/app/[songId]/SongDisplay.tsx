"use client";

import Image from "next/image";
import Link from "next/link";
import { DragHandle } from "@/components/drag-handle";
import { SongInfoCard } from "./SongInfoCard";
import { Song } from "@/lib/songs/song-parser";
import { PlatformButton } from "./PlatformButton";

import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "@/components/button";
import Icon from "@mdi/react";
import { mdiNoteEdit, mdiTrashCan } from "@mdi/js";
import { useRouter } from "next/navigation";

type Props = {
  song: Song;
};

export function SongDisplay(props: Props) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  const supabase = createClient();
  supabase.auth
    .getUser()
    .then((data) => setLoggedIn(data.data.user ? true : false));

  const song = props.song;
  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <motion.div
        initial={{ y: "-24px", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        className="relative -left-4 md:left-0 rounded-t-3xl w-screen md:w-full h-[400px] overflow-clip mix-blend-lighten"
      >
        <Image
          alt="cover"
          src={song.art_url || ""}
          className="blur-3xl w-full h-[400px]"
          width={256}
          height={256}
        />
        <div className="bg-gradient-to-b from-transparent to-background w-full h-[400px] -translate-y-[400px]" />
        <div className="flex flex-col justify-center items-center gap-2 p-8 w-full h-[336px] -translate-y-[800px]">
          <h1 className="font-semibold text-4xl text-center">{song.title}</h1>
          <span className="text-muted-foreground">
            {song.artists.map((artist) => artist.name).join(", ")}
          </span>
        </div>
      </motion.div>
      {/* INFO CARD */}
      <motion.div
        initial={{ y: "-24px", scale: 0.9, opacity: 0 }}
        animate={{ y: "0", scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <SongInfoCard song={song} />
      </motion.div>
      {/* DELETE SONG BUTTON */}
      {loggedIn && (
        <div className="flex gap-2 *:grow">
          <Button
            variant={"secondary"}
            className="mt-4"
            onClick={() => {
              router.push(window.location.href + "/edit");
            }}
          >
            <Icon path={mdiNoteEdit} size={0.75} />
            Edit
          </Button>
          <Button
            variant={"destructive"}
            className="mt-4"
            onClick={() => {
              supabase
                .from("releases")
                .delete()
                .eq("written_id", song.written_id)
                .then(() => {
                  router.push("/");
                });
            }}
          >
            <Icon path={mdiTrashCan} size={0.75} />
            Delete
          </Button>
        </div>
      )}
      {/* LINK SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        className="flex justify-center items-center w-full h-8"
      >
        <DragHandle width={64} height={2} />
      </motion.div>
      <div>
        {song.release_links.length > 0 && (
          <div className="flex flex-col gap-2">
            {song.release_links.map((link, key) => (
              <Link key={key} href={link.url} target="_blank">
                <PlatformButton entry={key} platform={link.platform} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
