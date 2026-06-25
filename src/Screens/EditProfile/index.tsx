import {parsePhoneNumberWithError} from 'libphonenumber-js';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, {CountryCode} from 'react-native-country-picker-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {setUserData} from '../../Redux/Slices/UserSlice/UserSlice';
import {useAppDispatch, useAppSelector} from '../../Redux/store';
import {CommonBtn, SizeBox} from '../../Utilities/Component/hooks/Helpers';
import ImagePath from '../../Utilities/Constants/ImagePath';
import STORAGE_KEYS from '../../Utilities/Constants/StorageKeys';
import {
  fetchProfileData,
  updateProfileData,
} from '../../Utilities/Constants/requestHandler';
import {getData} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import styles from './style';

const shopifyIProfilePicLink =
  'https://cdn.shopify.com/proxy/4a6d55ba95edd7b8266903d3e059f922b9a0474df99722d11e47c8c8e4ce1c74/www.gravatar.com/avatar/6751c75b13b135addb9dacdb3a807de4.jpg?s=2048&d=https%3A%2F%2Fcdn.shopify.com%2Fshopifycloud%2Fshopify%2Fassets%2Fadmin%2Fcustomers%2Fpolaris%2Favatar-2-a0ee6e3fb3ae515b66b68388b265e5bd1e90646c4c72d59170518f45351e668b.png';

const EditProfile = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.user);

  // States for input fields
  const [fullName, setFullName] = useState(
    user?.firstName + ' ' + user?.lastName || '',
  );

  const [email, setEmail] = useState(user?.email || '');
  const [country, setCountry] = useState(user?.defaultAddress?.country || '');
  const [visCalender, setVisCalender] = useState(false);
  const [isEdited, setisEdited] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [callingCode, setCallingCode] = useState('1');

  const handleSaveDetails = async () => {
    // Prepare updated data by comparing with the original user data
    const updatedData: Record<string, any> = {};

    if (fullName.split(' ')[0] !== user?.firstName) {
      updatedData.firstName = fullName.split(' ')[0];
    }

    if (fullName.split(' ')[1] !== user?.lastName) {
      updatedData.lastName = fullName.split(' ')[1];
    }

    if (email !== user?.email) {
      updatedData.email = email;
    }

    if (phoneNumber !== user?.phone) {
      updatedData.phone = phoneNumber;
    }

    // Only proceed if there are changes
    if (Object.keys(updatedData).length > 0 && user?.id) {
      try {
        const response = await updateProfileData(user.id, updatedData);

        if (response?.data) {
          await fetchProfile();
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const userEmail = await getData(STORAGE_KEYS.userEmail);

      if (userEmail) {
        const data = await fetchProfileData(userEmail);
        if (data.data?.customers?.edges[0]?.node) {
          dispatch(setUserData(data.data?.customers?.edges[0]?.node));
          navigation.goBack();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onVisibleCalender = () => {
    setVisCalender(!visCalender);
  };

  const onSelect = (country: any) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setCountry(country.name);
  };

  function getPhoneNumberDetails(phoneNumberStr: string) {
    try {
      const phoneNumber = parsePhoneNumberWithError(phoneNumberStr);
      return {
        country: phoneNumber.country, // e.g., "IN"
        callingCode: phoneNumber.countryCallingCode, // e.g., "91"
        nationalNumber: phoneNumber.nationalNumber, // e.g., "9015069479"
      };
    } catch (error) {
      return {error: 'Invalid phone number'};
    }
  }

  useEffect(() => {
    if (user) {
      setFullName(user?.firstName + ' ' + user?.lastName);
      setEmail(user?.email);
      setPhoneNumber(getPhoneNumberDetails(user?.phone).nationalNumber || '');
      setCountry(user?.defaultAddress?.country);
      setCountryCode(
        (getPhoneNumberDetails(user?.phone).callingCode as CountryCode) || 'US',
      );
      setCallingCode(getPhoneNumberDetails(user?.phone).callingCode || '1');
    }
  }, [user]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
      <KeyboardAwareScrollView
        extraScrollHeight={100}
        style={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <ImageBackground
            source={ImagePath.AppLogo}
            style={styles.imageBackground}
            resizeMode="cover">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{position: 'absolute', top: 10, left: 10}}
              activeOpacity={0.7}>
              <Image
                source={ImagePath.backClick}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </ImageBackground>
          <View style={styles.editedprofilecon}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <SizeBox size={2} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter full name"
              placeholderTextColor={Colors.greyTxt}
              value={fullName}
              onChangeText={text => {
                setFullName(text);
                setisEdited(true);
              }}
            />
            <SizeBox size={5} />
            <Text style={styles.inputLabel}>Email Address </Text>
            <SizeBox size={2} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter email or phone number"
              placeholderTextColor={Colors.greyTxt}
              value={email}
              onChangeText={text => {
                setEmail(text);
                setisEdited(true);
              }}
            />
            <SizeBox size={5} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{}}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.textInputContainer}>
                  <TouchableOpacity
                    onPress={onVisibleCalender}
                    style={styles.countryPickerContainer}>
                    <CountryPicker
                      visible={visCalender}
                      withCallingCode
                      withFlagButton={false}
                      onSelect={onSelect}
                      countryCode={countryCode}
                    />
                    <Text style={styles.callingCodeText}>+{callingCode}</Text>
                  </TouchableOpacity>
                  <TextInput
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    placeholderTextColor={Colors.black}
                    value={phoneNumber}
                    onChangeText={text => {
                      setPhoneNumber(text);
                      setisEdited(true);
                    }}
                  />
                </View>
              </View>
              {user?.defaultAddress &&  user?.defaultAddress.country && (
                <View style={{alignSelf: 'center'}}>
                  <Text style={styles.inputLabel}>Country</Text>
                  <TextInput
                    style={[styles.textInput, {paddingHorizontal: 20}]}
                    placeholder="Country name"
                    editable={false}
                    value={country}
                    placeholderTextColor={Colors.greyTxt}
                    onChangeText={text => {
                      setCountry(text);
                      setisEdited(true);
                    }}
                  />
                </View>
              )}
            </View>
            <SizeBox size={5} />
            <SizeBox size={45} />
          </View>
          <View style={{paddingHorizontal: 20}}>
            <CommonBtn
              isDisabled={!isEdited}
              onPress={handleSaveDetails}
              title={'Save Details'}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
