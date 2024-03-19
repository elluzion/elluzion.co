import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import { FormPartProps } from "./types";

export default function FormPart2(props: FormPartProps) {
  return (
    <div
      className="space-y-4"
      style={{ display: props.index == 1 ? "block" : "none" }}
    >
      <FormField
        control={props.form.control}
        name="coverUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Album cover URL</FormLabel>
            <FormControl>
              <Input placeholder="https://i1.sndcdn.com/..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <span className="font-medium text-sm">
        <br />
        Additional Info
      </span>
      <div className="gap-4 grid grid-cols-2">
        <FormField
          control={props.form.control}
          name="bpm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BPM</FormLabel>
              <FormControl>
                <Input placeholder="128" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input placeholder="Future Bass" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="releaseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Type</FormLabel>
              <FormControl>
                <Input placeholder="Remix" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input placeholder="E minor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="releaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release date</FormLabel>
              <FormControl>
                <Input
                  type={"date"}
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="Futurized" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
