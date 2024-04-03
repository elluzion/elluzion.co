import { ImageResponse } from "next/og";
import { size } from "./apple-icon";

// Route segment config
export const runtime = "edge";

export function generateImageMetadata() {
  return [
    {
      contentType: "image/png",
      size: { width: 16, height: 16 },
      id: "xsmall",
    },
    {
      contentType: "image/png",
      size: { width: 32, height: 32 },
      id: "small",
    },
    {
      contentType: "image/png",
      size: { width: 48, height: 48 },
      id: "medium",
    },
    {
      contentType: "image/png",
      size: { width: 192, height: 192 },
      id: "large",
    },
  ];
}
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 100,
        }}
      >
        <ElluzionIconSvg />
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}

export function ElluzionIconSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="55%" viewBox="0 0 192 102">
      <g id="surface1">
        <path
          stroke="none"
          fillRule="nonzero"
          fill="#fff"
          fillOpacity={1}
          d="M119.96.07c21.75,0,43.49,0,65.24,0,.53,0,1.08.07,1.6-.01,3.68-.58,6.52,3.2,4.57,7.2-6.3,12.9-12.4,25.89-18.59,38.85-.84,1.77-1.7,3.53-2.53,5.3-.93,1.99-2.47,2.93-4.66,2.92-15.11-.02-30.22,0-45.33-.02-10.78-.01-21.57-.05-32.35-.07-3.27,0-5.73,1.47-7.23,4.33-2.92,5.57-5.76,11.18-8.54,16.82-1.52,3.09.35,6.28,3.81,6.58,1.71.15,3.43.06,5.15.06,2.01,0,4.03.03,6.04-.02,3.5-.09,6.08-1.67,7.69-4.84,1.71-3.39,3.49-6.74,5.2-10.13,1.69-3.35,4.3-4.99,8.11-4.98,16.24.05,32.47.06,48.71-.01,2.8-.01,4.47,1.71,4.91,3.51.32,1.29-.03,2.45-.61,3.6-2.91,5.71-5.8,11.43-8.69,17.14-1.8,3.55-3.63,7.07-5.38,10.64-1.69,3.46-4.42,5.07-8.25,5.07-44.44-.02-88.88-.01-133.32-.01-.36,0-.71.01-1.07,0-3.39-.19-5.37-3.36-4.01-6.5.63-1.47,1.39-2.88,2.1-4.32C16.08,63.85,29.63,36.53,43.18,9.22c.69-1.38,1.38-2.76,2.05-4.15C46.87,1.69,49.5.05,53.3.05c22.22.04,44.44.02,66.66.02ZM110.19,20.04s0,0,0,.01c-2.01,0-4.02-.03-6.03,0-3.06.05-5.28,1.51-6.67,4.22-.68,1.32-1.34,2.64-1.95,3.99-1.48,3.24.33,6.51,3.89,6.65,4.19.17,8.4.14,12.59,0,3.14-.11,5.45-1.75,6.84-4.62.57-1.17,1.15-2.34,1.69-3.53,1.56-3.45-.38-6.62-4.13-6.72-2.07-.06-4.14,0-6.21,0Z"
        />
      </g>
    </svg>
  );
}
