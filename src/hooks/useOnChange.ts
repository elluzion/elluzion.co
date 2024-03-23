import { useEffect, useRef } from "react";

// credits: https://gist.github.com/nandorojo/7e9e86d8edecdf4b782c8b036c8da08d
export function useOnChange<T>(value: T, effect: (prev: T, next: T) => void) {
  const latestValue = useRef(value);
  const callback = useRef(effect);
  callback.current = effect;

  useEffect(
    function onChange() {
      if (value !== latestValue.current) {
        callback.current(latestValue.current, value);
      }
    },
    [value]
  );
}
