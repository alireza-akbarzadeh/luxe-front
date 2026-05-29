import { useCallback, useState } from 'react';

export function useControllableState<T>({
  prop,
  onChange,
  defaultProp
}: {
  prop?: T;
  onChange?: (value: T) => void;
  defaultProp?: T;
}): [T, (nextValue: T) => void] {
  const isControlled = prop !== undefined;

  const [internalValue, setInternalValue] = useState<T>(() => {
    return (defaultProp as T) ?? (prop as T);
  });

  const value = isControlled ? (prop as T) : internalValue;

  const setValue = useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange]
  );

  return [value, setValue];
}
