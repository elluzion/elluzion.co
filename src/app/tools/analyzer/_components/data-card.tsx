import { mdiCheck, mdiContentCopy } from "@mdi/js";
import Icon from "@mdi/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function DataCard(props: { mdiIconPath: string; title: string; subTitle: string }) {
  const [hasCopied, setHasCopied] = useState(false);

  // Might error out in debug due to insecure origin settings, should be fine in production
  function handleCopyClicked() {
    navigator.clipboard.writeText(props.subTitle).then(() => {
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, translateY: "16px" }}
      animate={{
        opacity: 1,
        scale: 1,
        translateY: "0px",
        transition: { duration: 0.8, ease: [0, 0.7, 0.2, 1.0] },
      }}
      className={`flex flex-col gap-3 bg-popover p-4 rounded-lg text-card-foreground group`}
    >
      <div className="flex items-center gap-2 font-semibold">
        <Icon path={props.mdiIconPath} size={1} />
        <span className="sm:text-lg grow">{props.title}</span>
        <div
          onClick={!hasCopied ? handleCopyClicked : () => {}}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground cursor-pointer"
        >
          <Icon path={hasCopied ? mdiCheck : mdiContentCopy} size={0.8} />
        </div>
      </div>
      <span>{props.subTitle}</span>
    </motion.div>
  );
}
