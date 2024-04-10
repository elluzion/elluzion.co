import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";

export const SongFormContext = createContext<SongFormContextType | undefined>(
  undefined
);

export const useSongFormContext = () => {
  const formContext = useContext(SongFormContext);

  if (!formContext) {
    throw new Error(
      "useFormContext has to be used within <FormContext.Provider>"
    );
  }

  return formContext;
};

export type SongFormContextType = {
  form: UseFormReturn<z.infer<typeof formSchema>, any, undefined>;
  editing: {
    is: boolean;
    permalink?: string;
  };
  index: {
    current: number;
    max: number;
    set: Dispatch<SetStateAction<number>>;
  };
  shouldSubmit: {
    current: boolean;
    set: Dispatch<SetStateAction<boolean>>;
  };
};
