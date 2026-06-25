import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  setCartItems,
  setIsAuth,
  setUserData,
} from '../../Redux/Slices/UserSlice/UserSlice';
import {useAppDispatch, useAppSelector} from '../../Redux/store';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import VectorIcon from '../../Utilities/Component/vectorIcons';
import ImagePath from '../../Utilities/Constants/ImagePath';
import NavigationStrings from '../../Utilities/Constants/NavigationStrings';
import STORAGE_KEYS from '../../Utilities/Constants/StorageKeys';
import {
  addCustomerAddres,
  deleteCustomer,
  fetchProfileData,
  logoutUser,
  updateCustomerAddres,
} from '../../Utilities/Constants/requestHandler';
import {getCountryCode, getData, removeData} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../Utilities/Styles/responsiveSize';
import styles from './styles';

const Profile = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

  const [address, setAddress] = useState({
    street: '',
    house: '',
    city: '',
    country: '',
  });
  const {user, isAuth, cartItems} = useAppSelector(state => state.user);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const onLogOut = async () => {
    const token = await getData(STORAGE_KEYS.accessToken);
    if (token) {
      const repsonse = await logoutUser(token);

      if (repsonse.data) {
        await removeData(STORAGE_KEYS.accessToken);
        await removeData(STORAGE_KEYS.userEmail);
        await removeData(STORAGE_KEYS.cartItems);

        dispatch(setCartItems([]));
        dispatch(setUserData(null));
        dispatch(setIsAuth(false));
        navigation.navigate(NavigationStrings.LoginScreen);
      }
    }
    setShowConfirmModal(false);
  };

  const onDeleteAccount = async () => {
    try {
      if (user) {
        const res = await deleteCustomer(user?.id);
        if (res.data) {
          await removeData(STORAGE_KEYS.accessToken);
          await removeData(STORAGE_KEYS.userEmail);
          await removeData(STORAGE_KEYS.cartItems);

          dispatch(setCartItems([]));
          dispatch(setUserData(null));
          dispatch(setIsAuth(false));
          navigation.navigate(NavigationStrings.LoginScreen);
        }
      }
    } catch (error) {
      console.log(error);
    }

    setShowDeleteAccountModal(false);
  };

  const conuntryCode = () => {
    if (user?.defaultAddress?.country) {
      return getCountryCode(user?.defaultAddress?.country.toUpperCase());
    }
    return 'US';
  };

  const renderCountryFlag = () => {
    const getFlagUrl = (countryCode: string) => {
      return countryCode
        ? `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`
        : null;
    };

    return (
      <Image
        source={{uri: getFlagUrl(conuntryCode() || 'US')!}}
        style={{width: 17, height: 17, borderRadius: 20}}
      />
    );
  };

  const fetchProfile = async () => {
    try {
      const userEmail = await getData(STORAGE_KEYS.userEmail);

      if (userEmail) {
        const data = await fetchProfileData(userEmail);
        if (data.data?.customers?.edges[0]?.node) {
          dispatch(setUserData(data.data?.customers?.edges[0]?.node));
          setIsEditModal(false);
          setModalVisible(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const token = await getData(STORAGE_KEYS.accessToken);
      if (!address.street.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Street is a required field.',
        });
        return false;
      }
      if (!address.city.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'City is a required field.',
        });
        return false;
      }
      if (!address.country.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Country is a required field.',
        });
        return false;
      }
      if (token && Object.values(address).every(item => item.length > 0)) {
        const res = await addCustomerAddres(token, {
          address1: address.street,
          address2: address.house,
          city: address.city,
          country: address.country,
        });

        if (res?.data?.customerAddressCreate?.customerAddress) {
          Toast.show({
            type: 'success',
            text1: 'Address added successfully',
          });
          await fetchProfile(); // Ensure fetchProfile is awaited properly
        }
      }
    } catch (err) {
      console.log(err);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again.',
      });
    }
  };

  const handleEditAddress = async (addressId: any) => {
    try {
      const token = await getData(STORAGE_KEYS.accessToken);

      if (token && Object.values(address).every(item => item.length > 0)) {
        console.log(address, token);

        const res = await updateCustomerAddres(
          token,
          {
            address1: address.street,
            address2: address.house,
            city: address.city,
            country: address.country,
          },
          addressId,
        );

        console.log(JSON.stringify(res));

        if (res?.data?.customerAddressUpdate?.customerAddress) {
          Toast.show({
            type: 'success',
            text1: 'Address Updated successfully',
          });
          await fetchProfile(); // Ensure fetchProfile is awaited properly
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  const openInsuranceLink = () => {
    const url =
      'https://www.travelexinsurance.com/homepage?location=44-0110&go=bp';
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {isAuth ? (
            <ImageBackground
              source={ImagePath.AppLogo}
              style={{width: width, height: moderateScale(298)}}>
              {isAuth && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => isAuth && navigation.navigate('EditProfile')}>
                  <Image
                    source={ImagePath.Edit}
                    style={{
                      height: 33,
                      width: 33,
                      alignSelf: 'flex-end',
                      marginRight: 10,
                      marginTop: 10,
                    }}
                  />
                </TouchableOpacity>
              )}
            </ImageBackground>
          ) : (
            <View style={{alignItems: 'center'}}>
              <SizeBox size={10} />
              <VectorIcon
                color={Colors.primaryblue}
                groupName="FontAwesome"
                name="user-circle"
                size={200}
              />
            </View>
          )}
          <View style={styles.profilecon}>
            {isAuth ? (
              <>
                <Text
                  style={{
                    ...commonStyles.font20navy,
                  }}>{`${user?.firstName} ${user?.lastName}`}</Text>
                <SizeBox size={5} />
                <View style={styles.countryimgcon}>
                  {renderCountryFlag()}
                  <Text style={styles.countrytxt}>
                    {user?.defaultAddress?.country}
                  </Text>
                </View>
                <SizeBox size={7} />
                <View style={styles.datecontainer}>
                  <View style={{flexDirection: 'row', padding: 5}}>
                    <Image
                      source={ImagePath.Call}
                      style={{
                        resizeMode: 'contain',
                        width: 31,
                        height: 30,
                        borderRadius: 15,
                      }}
                    />
                    <View style={{marginHorizontal: 10}}>
                      <Text style={styles.phonetxt}>Phone</Text>
                      <SizeBox size={2} />
                      <Text style={{...commonStyles.font12Regular}}>
                        {user?.phone}
                      </Text>
                    </View>
                  </View>
                  <SizeBox size={3} />
                  <View style={{flexDirection: 'row', padding: 5}}>
                    <Image
                      source={ImagePath.Mail}
                      style={{
                        resizeMode: 'contain',
                        width: 31,
                        height: 30,
                        borderRadius: 15,
                      }}
                    />
                    <View style={{marginHorizontal: 10}}>
                      <Text style={styles.phonetxt}>Email Address</Text>
                      <SizeBox size={1} />
                      <Text style={{...commonStyles.font12Regular}}>
                        {user?.email}
                      </Text>
                    </View>
                  </View>
                  <SizeBox size={3} />

                  <View style={{flexDirection: 'row', padding: 5}}>
                    <Image
                      source={ImagePath.Mail}
                      style={{
                        resizeMode: 'contain',
                        width: 31,
                        height: 30,
                        borderRadius: 15,
                      }}
                    />
                    <View style={{marginHorizontal: 10}}>
                      <Text style={styles.phonetxt}>Home Address</Text>
                      <SizeBox size={1} />
                      {user?.defaultAddress?.formattedArea ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 20,
                          }}>
                          <Text style={{...commonStyles.font12Regular}}>
                            {user?.defaultAddress?.formattedArea}
                          </Text>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              setIsEditModal(true);
                              setModalVisible(true);
                              setAddress({
                                street: user.addresses[0].address1,
                                house: user.addresses[0].address2,
                                city: user.addresses[0].city,
                                country: user.addresses[0].country,
                              });
                            }}>
                            <VectorIcon
                              size={20}
                              groupName="AntDesign"
                              name="edit"
                              color="black"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.addHomeButton}
                          activeOpacity={0.8}
                          onPress={() => setModalVisible(true)}>
                          <Text style={{...commonStyles.font12Regular}}>
                            Add Address
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.datecontainer}>
                <Text
                  style={{
                    ...commonStyles.font14Center,
                    color: Colors.navyblue,
                    marginTop: 5,
                  }}>
                  Login to Manage Your Orders
                </Text>
                <SizeBox size={5} />
                <TouchableOpacity
                  onPress={() => navigation.navigate('LoginScreen')}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: Colors.primaryblue,
                    borderRadius: 20,
                    padding: 10,
                  }}>
                  <Text style={{...commonStyles.font14Center}}>Login</Text>
                </TouchableOpacity>
                <SizeBox size={5} />
              </View>
            )}
            <SizeBox size={10} />
            <View style={styles.outerview}>
              {isAuth && (
                <>
                  <TouchableOpacity
                    style={styles.wrapper}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('MyBookings')}>
                    <View style={styles.imageview}>
                      <VectorIcon
                        groupName="Feather"
                        name="calendar"
                        size={16}
                        color={Colors.primaryblue}
                      />
                    </View>
                    <Text style={styles.bookingtxt}>My Bookings</Text>
                  </TouchableOpacity>
                  <SizeBox size={5} />
                  <View style={styles.bottomline} />
                  <SizeBox size={5} />
                </>
              )}
              {isAuth && (
                <>
                  <TouchableOpacity
                    style={styles.wrapper}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('ChangePassword')}>
                    <View style={styles.imageview}>
                      <VectorIcon
                        groupName="Feather"
                        name="lock"
                        size={16}
                        color={Colors.primaryblue}
                      />
                    </View>
                    <Text style={styles.bookingtxt}>Change Password</Text>
                  </TouchableOpacity>
                  <SizeBox size={5} />
                  <View style={styles.bottomline} />
                  <SizeBox size={5} />
                </>
              )}
              <TouchableOpacity
                style={styles.wrapper}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Support')}>
                <View style={styles.imageview}>
                  <Image
                    source={ImagePath.Support}
                    style={{
                      height: moderateScaleVertical(20),
                      width: moderateScale(20),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <Text style={styles.bookingtxt}>Support</Text>
              </TouchableOpacity>
            </View>
            <SizeBox size={10} />
            <View style={styles.outerview}>
              <TouchableOpacity
                style={styles.wrapper}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('CancellationPolicy');
                }}>
                <View style={styles.imageview}>
                  <Image
                    source={ImagePath.Policy}
                    style={{
                      height: moderateScaleVertical(16),
                      width: moderateScale(16),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <Text style={styles.bookingtxt}>Cancellation Policy</Text>
              </TouchableOpacity>
              <SizeBox size={5} />
              <View style={styles.bottomline} />
              <SizeBox size={5} />
              <TouchableOpacity
                style={styles.wrapper}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('PrivacyPolicy')}>
                <View style={styles.imageview}>
                  <Image
                    source={ImagePath.PrivacyPolicy}
                    style={{
                      height: moderateScaleVertical(16),
                      width: moderateScale(16),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <Text style={styles.bookingtxt}>Privacy Policy</Text>
              </TouchableOpacity>
              <SizeBox size={5} />
              <View style={styles.bottomline} />
              <SizeBox size={5} />
              <TouchableOpacity
                style={styles.wrapper}
                activeOpacity={0.8}
                onPress={openInsuranceLink}>
                <View style={styles.imageview}>
                  <Image
                    source={ImagePath.Insurance}
                    style={{
                      height: moderateScaleVertical(16),
                      width: moderateScale(16),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <Text style={styles.bookingtxt}>Travel Insurance</Text>
              </TouchableOpacity>

              {isAuth && (
                <>
                  <SizeBox size={5} />
                  <View style={styles.bottomline} />
                  <SizeBox size={5} />
                  <TouchableOpacity
                    style={styles.wrapper}
                    activeOpacity={0.8}
                    onPress={() => setShowConfirmModal(true)}>
                    <View style={styles.imageview}>
                      <VectorIcon
                        groupName="MaterialIcons"
                        name="logout"
                        size={16}
                        color={Colors.primaryblue}
                      />
                    </View>
                    <Text style={styles.bookingtxt}>Logout</Text>
                  </TouchableOpacity>
                  <SizeBox size={5} />
                  <View style={styles.bottomline} />
                  <SizeBox size={5} />
                  <TouchableOpacity
                    style={styles.wrapper}
                    activeOpacity={0.8}
                    onPress={() => setShowDeleteAccountModal(true)}>
                    <View style={styles.imageview}>
                      <VectorIcon
                        groupName="MaterialCommunityIcons"
                        name="account-remove"
                        size={16}
                        color={Colors.red}
                      />
                    </View>
                    <Text style={[styles.bookingtxt, {color: Colors.red}]}>
                      Delete Account
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <SizeBox size={20} />
          </View>
          <SizeBox size={20} />
        </ScrollView>
        {cartItems! > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              position: 'absolute',
              bottom: Platform.OS == 'android' ? 90 : 80,
              right: 20,
            }}
            onPress={() => navigation.navigate('Cart')}>
            <Image
              source={ImagePath.Cart}
              resizeMode="contain"
              style={{
                height: 50,
                width: 50,
                bottom: Platform.OS == 'android' ? 2 : 30,
              }}
            />
          </TouchableOpacity>
        )}

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View
            style={{
              position: 'absolute',
              top: 15,
              left: 0,
              right: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}>
            <Toast />
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            style={styles.modalOverlay}>
            <KeyboardAvoidingView
              onStartShouldSetResponder={() => true}
              onResponderRelease={e => e.stopPropagation()}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  {isEditModal ? 'Update Address' : 'Add Address'}
                </Text>
                <SizeBox size={10} />
                <TextInput
                  style={styles.input}
                  placeholder="Street"
                  value={address.street}
                  onChangeText={text => setAddress({...address, street: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="House/Apartment No."
                  value={address.house}
                  onChangeText={text => setAddress({...address, house: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={address.city}
                  onChangeText={text => setAddress({...address, city: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Couintry"
                  value={address.country}
                  onChangeText={text => setAddress({...address, country: text})}
                />
                {/* Save Button */}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    isEditModal
                      ? handleEditAddress(user?.addresses[0].id)
                      : handleSaveAddress();
                  }}
                  activeOpacity={0.8}>
                  <Text style={styles.saveButtonText}>
                    {isEditModal ? 'Update' : 'Save Address'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={showConfirmModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowConfirmModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.confirmationModalContainer}>
              <Text style={styles.confirmationText}>
                Are you sure you want to log out?
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    {backgroundColor: Colors.primaryblue},
                  ]}
                  onPress={() => setShowConfirmModal(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, {backgroundColor: Colors.red}]}
                  onPress={onLogOut}>
                  <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showDeleteAccountModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowDeleteAccountModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.confirmationModalContainer}>
              <Text style={styles.confirmationText}>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    {backgroundColor: Colors.primaryblue},
                  ]}
                  onPress={() => setShowDeleteAccountModal(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, {backgroundColor: Colors.red}]}
                  onPress={onDeleteAccount}>
                  <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default Profile;
