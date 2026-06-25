import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import {
  CommonBtn,
  CommonInput,
  SizeBox,
} from '../../Utilities/Component/hooks/Helpers';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {recoverCustomerAccount} from '../../Utilities/Constants/requestHandler';
import {isValidEmail} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import styles from './style';
import {useAppSelector} from '../../Redux/store';

const ChangePassword = ({navigation}: any) => {
  const {user} = useAppSelector(state => state.user);

  const [emailOrPhone, setEmailOrPhone] = useState(user?.email ?? '');
  const [loading, setLoading] = useState(false);

  const handlePasswordRecovery = async () => {
    if (!emailOrPhone) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in your email.',
        text2: 'The email field cannot be empty.',
      });
      return;
    }

    if (!isValidEmail(emailOrPhone)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
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
        setEmailOrPhone('');
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
          source={ImagePath.jahaaj}
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
          <View style={styles.UpdateContainer}>
            <SizeBox size={5} />
            <Image source={ImagePath.resetpass} style={styles.evolutionImage} />
            <SizeBox size={5} />
            <Text style={styles.title}>Update Password</Text>
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
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
