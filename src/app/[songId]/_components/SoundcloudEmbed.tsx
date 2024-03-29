"use client";

import { motion } from "framer-motion";

export default function SoundcloudEmbed(props: { trackUrl?: string }) {
  if (!props.trackUrl) return;
  return (
    <motion.div
      className="rounded-lg overflow-clip"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 1, ease: [0, 0.7, 0.2, 1.0], delay: 0.1 },
      }}
    >
      <iframe
        title="Soundcloud Embed"
        width="100%"
        height="166"
        src={`https://w.soundcloud.com/player/?url=${props.trackUrl}&color=%232563eb`}
      />
    </motion.div>
  );
}
