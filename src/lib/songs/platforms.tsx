import {
  SiAmazonmusic,
  SiApplemusic,
  SiPandora,
  SiSoundcloud,
  SiSpotify,
  SiTidal,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { mdiPlay } from "@mdi/js";
import Icon from "@mdi/react";
import { ReactElement } from "react";
export const Platforms: {
  LIST: PlatformItem[];
  resolve: (url: string) => PlatformItem;
} = {
  LIST: [
    {
      id: "spotify",
      name: "Spotify",
      accentColour: "#1ED760",
      linkIncludes: "open.spotify.com",
      icon: <SiSpotify />,
      darkForeground: true,
    },
    {
      id: "applemusic",
      name: "Apple Music",
      accentColour: "#ffffff",
      linkIncludes: "music.apple.com",
      icon: <SiApplemusic />,
      darkForeground: true,
    },
    {
      id: "soundcloud",
      name: "SoundCloud",
      accentColour: "#FF5500",
      linkIncludes: "soundcloud.com",
      icon: <SiSoundcloud />,
    },
    {
      id: "youtube",
      name: "YouTube",
      accentColour: "#FF0000",
      linkIncludes: "youtu",
      icon: <SiYoutube />,
    },
    {
      id: "amazonmusic",
      name: "Amazon Music",
      accentColour: "#FF9900",
      linkIncludes: "amazon",
      icon: <SiAmazonmusic />,
    },
    {
      id: "tidal",
      name: "Tidal",
      accentColour: "#17a2b8",
      linkIncludes: "tidal.com",
      icon: <SiTidal />,
    },
    {
      id: "deezer",
      name: "Deezer",
      accentColour: "#ff0092",
      linkIncludes: "deezer.com",
      icon: <Icon path={mdiPlay} size={0.75} />,
      darkForeground: true,
    },
    {
      id: "pandora",
      name: "Pandora",
      accentColour: "#00EAFF",
      linkIncludes: "pandora.com",
      icon: <SiPandora />,
      darkForeground: true,
    },
  ],
  /**
   * @returns platform as {@link PlatformItem} or undefined
   */
  resolve: (url: string) => {
    let platform = GenericPlatformItem;

    Platforms.LIST.map((plat) => {
      if (url.includes(plat.linkIncludes)) {
        platform = plat;
        return plat;
      }
    });

    return platform;
  },
};

const GenericPlatformItem: PlatformItem = {
  id: "generic",
  name: "Play",
  accentColour: "#262626",
  linkIncludes: "https://",
  icon: <Icon path={mdiPlay} size={0.75} />,
};

export type PlatformItem = {
  id: string;
  name: string;
  accentColour: string;
  linkIncludes: string;
  icon: ReactElement<any, any>;
  darkForeground?: boolean;
};
