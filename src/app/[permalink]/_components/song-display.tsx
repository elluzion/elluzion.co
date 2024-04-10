"use client";

import { DragHandle } from "@/components/drag-handle";
import { Platforms } from "@/lib/songs/platforms";
import { DBSong } from "@/lib/songs/types";
import { motion } from "framer-motion";
import LinkSection from "./link-section";
import SongEditSection from "./song-edit-section";
import SongHeader from "./song-header";
import { SongInfoCard } from "./song-info-card";
import SoundcloudEmbed from "./soundcloud-embed";

export function SongDisplay(props: { song: DBSong }) {
  const song = props.song;
  const soundcloudUrl = props.song.stream_links.find(
    (link) => Platforms.resolve(link.url).id == "soundcloud"
  )?.url;
  return (
    <main className="pt-0">
      {/* HEADER */}
      <SongHeader song={song} />
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
      {/* EDIT SONG */}
      <SongEditSection song={song} />
      {/* SOUNDCLOUD EMBED */}
      {soundcloudUrl && <SoundcloudEmbed trackUrl={soundcloudUrl} />}
      {/* DRAG HANDLE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        className="flex justify-center items-center w-full h-4"
      >
        <DragHandle width={64} height={2} />
      </motion.div>
      {/* LINK SECTION */}
      <LinkSection song={song} />
    </main>
  );
}
