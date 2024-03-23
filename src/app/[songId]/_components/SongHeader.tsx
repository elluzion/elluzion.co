import { Song } from "@/lib/songs/song-parser";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SongHeader(props: { song: Song }) {
  return (
    <motion.div
      initial={{ y: "-24px", opacity: 0 }}
      animate={{ y: "0", opacity: 1 }}
      className="relative -left-4 md:left-0 rounded-t-3xl w-screen md:w-full h-[400px] overflow-clip mix-blend-lighten"
    >
      <Image
        alt="cover"
        src={props.song.art_url || ""}
        className="blur-3xl w-full h-[400px]"
        width={256}
        height={256}
      />
      <div className="bg-gradient-to-b from-transparent to-background w-full h-[400px] -translate-y-[400px]" />
      <div className="flex flex-col justify-center items-center gap-2 p-8 w-full h-[336px] -translate-y-[800px]">
        <h1 className="font-semibold text-4xl text-center">
          {props.song.title}
        </h1>
        <span className="text-muted-foreground">
          {props.song.artists.map((artist) => artist.name).join(", ")}
        </span>
      </div>
    </motion.div>
  );
}
