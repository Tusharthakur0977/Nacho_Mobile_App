import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const useKeyboardListener = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const listener1 = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const listener2 = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      listener2.remove();
      listener1.remove();
    };
  }, []);
  return { isKeyboardVisible };
};

export default useKeyboardListener;
