import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  CommonBtn,
  CommonInput,
  CommonPassword,
  SizeBox,
} from '../../Utilities/Component/hooks/Helpers';
import ImagePath from '../../Utilities/Constants/ImagePath';
import NavigationStrings from '../../Utilities/Constants/NavigationStrings';
import {loginUser} from '../../Utilities/Constants/requestHandler';
import STORAGE_KEYS from '../../Utilities/Constants/StorageKeys';
import {storeData} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import styles from './style';

const LoginScreen = ({navigation, route}: any) => {
  const insets = useSafeAreaInsets();
  const {email, password: pass} = route?.params || {};
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [username, setUsername] = useState(email || '');
  const [password, setPassword] = useState(pass || '');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onLogin = async () => {
    if (!username || !password) {
      Toast.show({
        type: 'error',
        text1: 'Hello',
        text2: 'Please fill all fields first.',
      });
      return;
    }
    try {
      const response = await loginUser(username, password);

      if (response.data) {
        await storeData(
          STORAGE_KEYS.accessToken,
          response.data.customerAccessTokenCreate.customerAccessToken
            .accessToken,
        );
        if (
          response.data.customerAccessTokenCreate.customerAccessToken
            .accessToken
        ) {
          await storeData(STORAGE_KEYS.userEmail, username);
        }

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
        });
        setTimeout(() => {
          navigation.navigate(NavigationStrings.TabRoutes);
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: response.data?.errors?.[0]?.message || 'Invalid credentials.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid credentials. Please try again.',
      });
    }
  };

  const onForget = () => {
    navigation.navigate(NavigationStrings.ForgotPassword);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : -50}
        >
        <ImageBackground
          source={ImagePath.Onboardingtwo}
          style={styles.imageBackground}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{position: 'absolute', top: 10, left: 10}}
              activeOpacity={0.7}>
              <Image
                source={ImagePath.backClick}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <SizeBox size={3} />
              <Image
                source={ImagePath.Evolution}
                style={styles.evolutionImage}
              />
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>
                Enter your credentials to log in.
              </Text>
              <SizeBox size={3} />

              {/* Email or Phone Input */}
              <Text style={styles.inputLabel}>Email or Phone</Text>
              <SizeBox size={1} />
              <CommonInput
                placeholder="Enter email or phone number"
                value={username}
                onChangeText={text => {
                  setUsername(text);
                  if (errorMessage) setErrorMessage('');
                }}
              />
              <SizeBox size={3} />

              {/* Password Input */}
              <Text style={styles.inputLabel}>Password</Text>
              <SizeBox size={1} />
              <CommonPassword
                value={password}
                placeholder="Enter password"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                groupName="Entypo"
                name={isPasswordVisible ? 'eye' : 'eye-with-line'}
                size={15}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                onChangeText={text => {
                  setPassword(text);
                  if (errorMessage) setErrorMessage('');
                }}
              />

              <SizeBox size={3} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                {/* <View style={styles.keepLoggedInContainer}>
                  <TouchableOpacity
                    onPress={() => setKeepMeLoggedIn(!keepMeLoggedIn)}
                    activeOpacity={0.7}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <VectorIcon
                      groupName="AntDesign"
                      name={keepMeLoggedIn ? 'checksquare' : 'square'}
                      size={20}
                      style={styles.checkbox}
                      color={
                        keepMeLoggedIn ? Colors.primaryblue : Colors.greytext
                      }
                    />
                  </TouchableOpacity>
                  <Text style={styles.keepLoggedInText}>Keep me logged in</Text>
                </View> */}

                <TouchableOpacity activeOpacity={0.7} onPress={onForget}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>

              <SizeBox size={5} />

              {/* Login Button */}
              <CommonBtn onPress={onLogin} title={'Login'} />
              <SizeBox size={3} />

              {/* Create Account Link */}
              <Text style={[styles.subtitle, {textAlign: 'center'}]}>
                Don’t have an account?{' '}
                <Text
                  style={styles.createtxt}
                  onPress={() => {
                    setUsername(''), setPassword('');
                    navigation.navigate(NavigationStrings.RegisterScreen);
                  }}>
                  Create one.
                </Text>
              </Text>
            </View>
          </ImageBackground>
        </KeyboardAwareScrollView>
      <Toast topOffset={insets.top} />
    </SafeAreaView>
  );
};

export default LoginScreen;
