"use client";

import { useEffect, useState } from "react";

function isTouchDevice() {
  if (typeof window !== "undefined") {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }
  return true;
}

export default function CursorBacklight() {
  const [xPos, setXpos] = useState(0);
  const [yPos, setYpos] = useState(-1000);
  const [isMobile, setIsMobile] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    setIsMobile(isTouchDevice());

    if (!isMobile) {
      const onMouseMove = (e: MouseEvent) => {
        setXpos(e.x);
        setYpos(e.y);
      };

      document.onmousemove = onMouseMove;
      document.onmousedown = (e) => {
        setIsMouseDown(true);
      };
      document.onmouseup = (e) => {
        setIsMouseDown(false);
      };
    }
  }, [isMobile]);

  return (
    <span
      className="-z-10 fixed bg-blue-600 p-16 rounded-full transition-[opacity,filter] -translate-x-1/2 -translate-y-1/2 duration-300 pointer-events-none"
      style={{
        left: xPos + "px",
        top: yPos + "px",
        visibility: isMobile ? "hidden" : "visible",
        opacity: isMouseDown ? "0.5" : "0.55",
        filter: isMouseDown ? "blur(40px)" : "blur(64px)",
      }}
    ></span>
  );
}
