import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {
  CommonBtn,
  CommonInput,
  SizeBox,
} from '../../Utilities/Component/hooks/Helpers';
import styles from './style';
import NavigationStrings from '../../Utilities/Constants/NavigationStrings';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors} from '../../Utilities/Styles/colors';
import {recoverCustomerAccount} from '../../Utilities/Constants/requestHandler';
import Toast from 'react-native-toast-message';

const ForgotPassword = ({navigation}: any) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordRecovery = async () => {
    if (!emailOrPhone) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in your email or phone number.',
        text2: 'The email or phone field cannot be empty.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await recoverCustomerAccount(emailOrPhone);

      const userErrors = response.data?.customerRecover?.userErrors[0];

      if (userErrors && userErrors.length > 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: userErrors[0]?.message || 'An unknown error occurred.',
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Recovery Email Sent',
          text2: 'A recovery email has been sent to your provided address.',
        });
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={ImagePath.Onboardingtwo}
          style={styles.imageBackground}>
          <Toast />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{position: 'absolute', top: 10, left: 10}}
            activeOpacity={0.7}>
            <Image
              source={ImagePath.backClick}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
          <View style={styles.forgotContainer}>
            <SizeBox size={5} />
            <Image source={ImagePath.Evolution} style={styles.evolutionImage} />
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Fill in your details to reset your password.
            </Text>
            <SizeBox size={10} />

            <Text style={styles.inputLabel}>Email</Text>
            <SizeBox size={2} />
            <CommonInput
              placeholder="Enter your email"
              keyboardType="email-address"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
            />
            <SizeBox size={20} />
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primaryblue} />
            ) : (
              <CommonBtn onPress={handlePasswordRecovery} title={'Confirm'} />
            )}
            <SizeBox size={5} />
            <Text style={[styles.subtitle, {textAlign: 'center'}]}>
              Remember Password?{' '}
              <Text
                style={styles.createtxt}
                onPress={() =>
                  navigation.navigate(NavigationStrings.LoginScreen)
                }>
                Login
              </Text>
            </Text>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
