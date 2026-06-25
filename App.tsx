import { ShopifyCheckoutSheetProvider } from '@shopify/checkout-sheet-kit';
import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { SplashScreen } from './src/Navigation';
import Routes from './src/Navigation/Routes';
import { store } from './src/Redux/store';
import NetworkLogger from './src/Utilities/Component/NetworkLogger';

LogBox.ignoreAllLogs();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = () => {
      setTimeout(() => {
        setIsReady(true);
      }, 2500);
    };
    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <ShopifyCheckoutSheetProvider>
          <SafeAreaProvider>
            {isReady ? <Routes /> : <SplashScreen />}
            {__DEV__ && <NetworkLogger />}
            <Toast />
          </SafeAreaProvider>
        </ShopifyCheckoutSheetProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
