import {
  IconType,
  SiApplemusic,
  SiSpotify,
  SiYoutube,
  SiTidal,
  SiPandora,
  SiSoundcloud,
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiTwitter,
} from "@icons-pack/react-simple-icons";
import { ReactElement } from "react";

interface Platform {
  id: string;
  name: string;
  accentColour: string;
  icon: ReactElement<any, any>;
}

export const Platforms: Array<Platform> = [
  {
    id: "spotify",
    name: "Spotify",
    accentColour: "#1ED760",
    icon: <SiSpotify />,
  },
  {
    id: "applemusic",
    name: "Apple Music",
    accentColour: "#000000",
    icon: <SiApplemusic />,
  },
  {
    id: "youtube",
    name: "YouTube",
    accentColour: "#FF0000",
    icon: <SiYoutube />,
  },
  {
    id: "amazonmusic",
    name: "Amazon Music",
    accentColour: "#FF9900",
    icon: <SiSpotify />,
  },
  {
    id: "tidal",
    name: "Tidal",
    accentColour: "#17a2b8",
    icon: <SiTidal />,
  },
  {
    id: "pandora",
    name: "Pandora",
    accentColour: "#00EAFF",
    icon: <SiPandora />,
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    accentColour: "#FF5500",
    icon: <SiSoundcloud />,
  },
  {
    id: "facebook",
    name: "Facebook",
    accentColour: "#1877F2",
    icon: <SiFacebook />,
  },
  {
    id: "instagram",
    name: "Instagram",
    accentColour: "#833AB4",
    icon: <SiInstagram />,
  },
  {
    id: "tiktok",
    name: "TikTok",
    accentColour: "#0000FF",
    icon: <SiTiktok />,
  },
  {
    id: "twitter",
    name: "Twitter",
    accentColour: "#1DA1F2",
    icon: <SiTwitter />,
  },
  {
    id: "reddit",
    name: "Reddit",
    accentColour: "#FF5700",
    icon: <SiSpotify />,
  },
];
