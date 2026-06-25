import 'react-native-gesture-handler';
import React from 'react';
import NavigationStrings from '../Utilities/Constants/NavigationStrings';
import * as screens from './index';

export default function AuthStack(Stack: any) {
  return (
    <>
      <Stack.Screen
        name={NavigationStrings?.OnBoarding}
        component={screens?.OnBoarding}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.LoginScreen}
        component={screens.LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.RegisterScreen}
        component={screens?.RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.ForgotPassword}
        component={screens?.ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.OtpScreen}
        component={screens?.OtpScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.UpdatePassword}
        component={screens?.UpdatePassword}
        options={{headerShown: false}}
      />
    </>
  );
}
