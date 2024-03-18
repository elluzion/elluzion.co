import { UseFormReturn } from "react-hook-form";

export type Artist = {
  id: number | undefined;
  name: string;
};

export type StreamLink = {
  platformId: string;
  name: string;
  url: string;
};

export type DownloadLink = {
  format: string;
  edit: string;
  url: string;
};

export type FormPartProps = {
  index: number;
  form: UseFormReturn<any, any, undefined>;
};
