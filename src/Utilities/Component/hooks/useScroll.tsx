import {useCallback, useRef} from 'react';

import useKeyboardListener from './useKeyboardListener';

interface InputRefs {
  [key: string]: {focus: () => void} | null;
}

interface ScrollRef {
  scrollToPosition: (x: number, y: number, animated: boolean) => void;
  scrollToFocusedInput: (node: any, extraHeight: number) => void;
}

const useScroll = () => {
  const {isKeyboardVisible} = useKeyboardListener();

  const inputsRef = useRef<InputRefs>({});
  const scrollRef = useRef<ScrollRef | null>(null);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  const focusAction = useCallback((key: string) => {
    if (!inputsRef.current[key]) {
      return;
    }
    inputsRef.current[key]?.focus();
  }, []);

  const scrollTo = useCallback(
    (scrollItem: any) => {
      const time = isKeyboardVisible ? 10 : 120;
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      scrollTimer.current = setTimeout(() => {
        if (scrollItem === 'ScrollTop') {
          scrollRef.current?.scrollToPosition(0, 0, true);
          return;
        }
        scrollRef.current?.scrollToFocusedInput(scrollItem, 300);
      }, time);
    },
    [isKeyboardVisible],
  );

  const registerInput = useCallback((name: string) => {
    return (ref: {focus: () => void} | null) => {
      inputsRef.current[name] = ref;
    };
  }, []);

  return {
    inputsRef,
    scrollRef,
    focusAction,
    scrollTo,
    isKeyboardVisible,
    registerInput,
  };
};

export default useScroll;
