import { useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(
  value: T,
  delayMs = 300,
): [T, () => void] {
  const [debounced, setDebounced] = useState(value);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  function flush() {
    setDebounced(valueRef.current);
  }

  return [debounced, flush];
}
