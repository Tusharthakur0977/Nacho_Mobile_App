import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  CommonBtn,
  CommonInput,
  CommonPassword,
  SizeBox,
} from '../../Utilities/Component/hooks/Helpers';
import ImagePath from '../../Utilities/Constants/ImagePath';
import NavigationStrings from '../../Utilities/Constants/NavigationStrings';
import { registerUserApi } from '../../Utilities/Constants/requestHandler';
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
} from '../../Utilities/Helpers';
import { Colors } from '../../Utilities/Styles/colors';
import styles from './style';

const Checkbox = ({
  checked,
  onPress,
  label,
}: {
  checked: boolean;
  onPress: () => void;
  label: string;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
    <View style={[styles.checkBox, checked && styles.checkedBox]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

const RegisterScreen = ({navigation}: any) => {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [callingCode, setCallingCode] = useState('1');
  const [visCalender, setVisCalender] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  // Register functionality
  const registerUser = async () => {
    // Full name validation
    if (!fullName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Name',
        text2: 'Please enter your full name.',
      });
      return;
    }

    // Email validation
    if (!isValidEmail(emailOrPhone)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
      return;
    }

    // Phone validation
    // if (!isValidPhone(phoneNumber)) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Invalid Phone Number',
    //     text2: 'Enter a valid phone number (7–15 digits).',
    //   });
    //   return;
    // }

    // Password validation
    if (!isValidPassword(password)) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 8 characters long.',
      });
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Password and confirm password do not match.',
      });
      return;
    }

    const data = {
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ')[1] || '',
      email: emailOrPhone,
      password: confirmPassword,
      // phone: `+${callingCode}${phoneNumber}`,
      acceptsMarketing: acceptsMarketing,
    };

    try {
      const response = await registerUserApi(data);

      if (
        response.data?.customerCreate &&
        response.data?.customerCreate.customerUserErrors.length === 0
      ) {
        Toast.show({
          type: 'success',
          text1: 'Registration successful!',
          text2: 'Logging you in...',
        });

        navigation.navigate(NavigationStrings.LoginScreen, {
          email: emailOrPhone,
          password: confirmPassword,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2:
            response.data?.customerCreate.customerUserErrors?.[0]?.message ||
            'Something went wrong.',
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to register. Please try again later.',
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : -50}
        bounces={false}>
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

          <View style={styles.RegisterContainer}>
            <SizeBox size={3} />
            <Image source={ImagePath.Evolution} style={styles.evolutionImage} />
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>
              Fill in your details to register.
            </Text>
            <SizeBox size={3} />

            {/* Full Name */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <SizeBox size={1} />
            <CommonInput
              placeholder="Enter full name"
              value={fullName}
              onChangeText={setFullName}
            />
            <SizeBox size={3} />

            {/* Email or Phone */}
            <Text style={styles.inputLabel}>Email</Text>
            <SizeBox size={1} />
            <CommonInput
              placeholder="Enter email"
              keyboardType="email-address"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
            />
            <SizeBox size={3} />

            {/* Phone Number */}
            <Text style={styles.inputLabel}>Phone Number</Text>
            <SizeBox size={1} />
            <View style={styles.textInputContainer}>
              <TouchableOpacity
                onPress={() => setVisCalender(!visCalender)}
                style={styles.countryPickerContainer}>
                <Text style={styles.callingCodeText}>+{callingCode}</Text>
              </TouchableOpacity>
              <CountryPicker
                visible={visCalender}
                withCallingCode
                onClose={() => setVisCalender(false)}
                withFlagButton={false}
                onSelect={onSelect}
                countryCode={countryCode}
              />
              <TextInput
                placeholder="Phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={{flex: 1}}
              />
            </View>
            <SizeBox size={3} />

            {/* Password */}
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
              onChangeText={setPassword}
            />
            <SizeBox size={3} />

            {/* Confirm Password */}
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <SizeBox size={1} />
            <CommonPassword
              value={confirmPassword}
              placeholder="Confirm password"
              secureTextEntry={!isConfirmPasswordVisible}
              autoCapitalize="none"
              groupName="Entypo"
              name={isConfirmPasswordVisible ? 'eye' : 'eye-with-line'}
              size={15}
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
              onChangeText={setConfirmPassword}
            />
            <SizeBox size={5} />

            {/* NEW MARKETING CONSENT UI */}
            <Checkbox
              checked={acceptsMarketing}
              onPress={() => setAcceptsMarketing(!acceptsMarketing)}
              label="Yes, I want to receive marketing emails and SMS updates."
            />
            <SizeBox size={5} />
            {/* END NEW MARKETING CONSENT UI */}

            <CommonBtn onPress={registerUser} title={'Sign Up'} />
            <SizeBox size={3} />

            <Text style={[styles.subtitle, {textAlign: 'center'}]}>
              Already have an account?
              <Text
                style={styles.createtxt}
                onPress={() =>
                  navigation.navigate(NavigationStrings.LoginScreen)
                }>
                {' '}
                Login
              </Text>
            </Text>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
      <Toast topOffset={insets.top} />
    </SafeAreaView>
  );
};

export default RegisterScreen;
