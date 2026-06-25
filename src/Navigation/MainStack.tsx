import 'react-native-gesture-handler';
import React from 'react';
import NavigationStrings from '../Utilities/Constants/NavigationStrings';
import * as screens from './index';
import TabRoutes from './TabRoutes';
export default function MainStack(Stack: any) {
  return (
    <>
      <Stack.Screen
        name={NavigationStrings?.TabRoutes}
        component={TabRoutes}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.EditProfile}
        component={screens?.EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.MyBookings}
        component={screens?.MyBookings}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.Support}
        component={screens?.Support}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.PrivacyPolicy}
        component={screens?.PrivacyPolicy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.BookingSummary}
        component={screens?.BookingSummary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.Cart}
        component={screens?.Cart}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.PackageDetail}
        component={screens?.PackageDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.UploadScreen}
        component={screens?.UploadScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.ImageApprovals}
        component={screens?.ImageApprovals}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.PlanTrip}
        component={screens?.PlanTrip}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.WaverForm}
        component={screens?.WaverForm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.ChangePassword}
        component={screens?.ChangePassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.WebViewScreen}
        component={screens?.WebViewScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.CancellationPolicy}
        component={screens?.CancellationPolicy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.Search}
        component={screens?.SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NavigationStrings?.Collection}
        component={screens?.CollectionScreen}
        options={{headerShown: false}}
      />
    </>
  );
}
