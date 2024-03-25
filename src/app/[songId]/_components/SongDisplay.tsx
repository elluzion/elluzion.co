"use client";

import { DragHandle } from "@/components/drag-handle";
import { Song } from "@/lib/songs/song-parser";
import { motion } from "framer-motion";
import LinkSection from "./LinkSection";
import SongEditSection from "./SongEditSection";
import SongHeader from "./SongHeader";
import { SongInfoCard } from "./SongInfoCard";

export function SongDisplay(props: { song: Song }) {
  const song = props.song;
  return (
    <div className="flex flex-col">
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
      {/* DRAG HANDLE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        className="flex justify-center items-center w-full h-8"
      >
        <DragHandle width={64} height={2} />
      </motion.div>
      {/* LINK SECTION */}
      <LinkSection song={song} />
    </div>
  );
}
