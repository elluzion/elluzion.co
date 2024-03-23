import { UseFormReturn } from "react-hook-form";

export type Artist = {
  id: number | undefined;
  name: string;
};

export type StreamLink = {
  platformId: string;
  url: string;
};

export type DownloadLink = {
  format: string;
  edit: string;
  url: string;
};

export type FormPageProps = {
  editing?: string;
  index: number;
  form: UseFormReturn<any, any, undefined>;
};
