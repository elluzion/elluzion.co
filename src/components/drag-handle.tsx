import React from "react";

interface DragHandleProps extends React.StyleHTMLAttributes<HTMLSpanElement> {
  width: number | 64;
  height: number | 4;
}

export const DragHandle = React.forwardRef<HTMLSpanElement, DragHandleProps>(
  ({ className, width, height, ...props }, ref) => {
    return (
      <span
        className={"rounded-full bg-border flex"}
        style={{
          width: width + "px",
          height: height + "px",
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
DragHandle.displayName = "DragHandle";
