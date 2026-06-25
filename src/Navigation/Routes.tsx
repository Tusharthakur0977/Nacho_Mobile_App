import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import {getData} from '../Utilities/Helpers';
import STORAGE_KEYS from '../Utilities/Constants/StorageKeys';
import {useAppDispatch, useAppSelector} from '../Redux/store';
import {setIsAuth, setIsOnboarded} from '../Redux/Slices/UserSlice/UserSlice';
import {ActivityIndicator, View} from 'react-native';
import {Colors} from '../Utilities/Styles/colors';
import NavigationStrings from '../Utilities/Constants/NavigationStrings';
import {createNavigationContainerRef} from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator();

export default function Routes() {
  const dispatch = useAppDispatch();
  const {isAuth, isOnBoarded} = useAppSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading

  // Fetch authentication data
  const fetchAuthenticationData = async () => {
    const storedToken = await getData(STORAGE_KEYS.accessToken);
    const storedEmail = await getData(STORAGE_KEYS.userEmail);
    const storedIsOnBoarded = await getData(STORAGE_KEYS.isOnBoarded);

    if (storedIsOnBoarded) {
      dispatch(setIsOnboarded(storedIsOnBoarded ?? false));
    }

    if (storedToken && storedEmail) {
      dispatch(setIsAuth(true));
    } else {
      dispatch(setIsAuth(false));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAuthenticationData();
  }, []);

  // Show loading spinner until authentication is checked
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.white,
        }}>
        <ActivityIndicator size="large" color={Colors.darkPink} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{animation: 'ios_from_right'}}
        initialRouteName={
          isOnBoarded
            ? NavigationStrings.TabRoutes
            : NavigationStrings.OnBoarding
        }>
        {AuthStack(Stack)}
        {MainStack(Stack)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
