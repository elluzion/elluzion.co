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
      className="p-16 rounded-full bg-blue-600 fixed z-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-[opacity,filter] duration-300"
      style={{
        left: xPos + "px",
        top: yPos + "px",
        visibility: isMobile ? "hidden" : "visible",
        opacity: isMouseDown ? "0.45" : "0.55",
        filter: isMouseDown ? "blur(48px)" : "blur(64px)",
      }}
    ></span>
  );
}
