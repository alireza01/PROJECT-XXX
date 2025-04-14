import { useState, useEffect, useCallback, useRef } from 'react';

// Types
export type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

// Default options
const defaultOptions: DebounceOptions = {
  leading: false,
  trailing: true,
  maxWait: undefined,
};

// Utility function to create a debounced function
export function createDebouncedFunction<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): (...args: Parameters<T>) => void {
  const { leading, trailing, maxWait } = { ...defaultOptions, ...options };
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;
  let result: ReturnType<T>;

  const invokeFunc = (time: number) => {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args as Parameters<T>);
    return result;
  };

  const startTimer = (pendingFunc: () => void, wait: number) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(pendingFunc, wait);
  };

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      !lastCallTime ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  };

  const trailingEdge = (time: number) => {
    timeoutId = null;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null;
    lastThis = null;
    return result;
  };

  const debounced = function (this: any, ...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (!timeoutId) {
        lastInvokeTime = time;
        if (leading) {
          return invokeFunc(time);
        }
      }
      if (maxWait !== undefined) {
        timeoutId = setTimeout(trailingEdge, wait);
        return invokeFunc(time);
      }
    }
    if (!timeoutId) {
      timeoutId = setTimeout(trailingEdge, wait);
    }
    return result;
  };

  // Cleanup function
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastThis = null;
    lastCallTime = null;
    timeoutId = null;
  };

  // Flush function to immediately invoke the debounced function
  debounced.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      return trailingEdge(Date.now());
    }
    return result;
  };

  return debounced;
}

// React hook for debouncing values
export function useDebounce<T>(
  value: T,
  delay: number = 500,
  options: DebounceOptions = {}
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const debouncedFunc = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!debouncedFunc.current) {
      debouncedFunc.current = createDebouncedFunction(
        (newValue: T) => setDebouncedValue(newValue),
        delay,
        options
      );
    }

    debouncedFunc.current(value);

    return () => {
      if (debouncedFunc.current) {
        debouncedFunc.current.cancel();
      }
    };
  }, [value, delay, options]);

  return debouncedValue;
}

// React hook for debouncing functions
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  options: DebounceOptions = {}
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback);
  const debouncedFunc = useRef<((...args: Parameters<T>) => void) | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!debouncedFunc.current) {
      debouncedFunc.current = createDebouncedFunction(
        (...args: Parameters<T>) => callbackRef.current(...args),
        delay,
        options
      );
    }

    return () => {
      if (debouncedFunc.current) {
        debouncedFunc.current.cancel();
      }
    };
  }, [delay, options]);

  return useCallback((...args: Parameters<T>) => {
    if (debouncedFunc.current) {
      debouncedFunc.current(...args);
    }
  }, []);
}

// Example usage:
/*
// For values:
const debouncedValue = useDebounce(value, 500);

// For callbacks:
const debouncedCallback = useDebouncedCallback((value) => {
  // Your callback logic here
}, 500);

// For standalone functions:
const debouncedFunction = createDebouncedFunction((value) => {
  // Your function logic here
}, 500);
*/ 