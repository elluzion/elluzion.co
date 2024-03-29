import { cn } from "@/lib/utils";
import { mdiInformation } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

export const InfoCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex gap-4 bg-popover opacity-75 p-4 rounded-lg font-mono text-popover-foreground text-sm",
      className
    )}
    {...props}
  >
    <Icon path={mdiInformation} size={0.75} className="shrink-0" />
    <p>{children}</p>
  </div>
));
InfoCard.displayName = "Card";
