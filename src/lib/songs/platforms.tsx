import {
  SiApplemusic,
  SiSpotify,
  SiYoutube,
  SiTidal,
  SiPandora,
  SiSoundcloud,
  SiAmazonmusic,
} from "@icons-pack/react-simple-icons";
import { mdiPlay } from "@mdi/js";
import Icon from "@mdi/react";
import { ReactElement } from "react";

export interface Platform {
  id: string;
  name: string;
  accentColour: string;
  icon: ReactElement<any, any>;
  darkForeground?: boolean;
}

export const Platforms: Array<Platform> = [
  {
    id: "spotify",
    name: "Spotify",
    accentColour: "#1ED760",
    icon: <SiSpotify />,
    darkForeground: true,
  },
  {
    id: "applemusic",
    name: "Apple Music",
    accentColour: "#ffffff",
    icon: <SiApplemusic />,
    darkForeground: true,
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    accentColour: "#FF5500",
    icon: <SiSoundcloud />,
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
    icon: <SiAmazonmusic />,
  },
  {
    id: "tidal",
    name: "Tidal",
    accentColour: "#17a2b8",
    icon: <SiTidal />,
  },
  {
    id: "deezer",
    name: "Deezer",
    accentColour: "#ff0092",
    icon: <Icon path={mdiPlay} size={0.75} />,
    darkForeground: true,
  },
  {
    id: "pandora",
    name: "Pandora",
    accentColour: "#00EAFF",
    icon: <SiPandora />,
    darkForeground: true,
  },
];
