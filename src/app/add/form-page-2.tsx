import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import { useSongFormContext } from "./contexts";

export default function FormPage2() {
  const context = useSongFormContext();

  return (
    <div
      className="space-y-4"
      style={{ display: context.index.current == 1 ? "block" : "none" }}
    >
      <FormField
        control={context.form.control}
        name="art_url"
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
          control={context.form.control}
          name="tempo"
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
          control={context.form.control}
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
          control={context.form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Type</FormLabel>
              <FormControl>
                <Input placeholder="Original, Remix" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={context.form.control}
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
          control={context.form.control}
          name="release_date"
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
          control={context.form.control}
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
