import React from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import ImagePath from '../../Utilities/Constants/ImagePath';
import styles from './style';
import commonStyles from '../../Utilities/Styles/commonStyles';

const Support = ({navigation}: any) => {
  const phone = '+1 435-214-6781';
  const email = 'example@gmail.com';
  const address = '1600 Amphitheatre Parkway, Mountain View, CA';

  const openDialer = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() =>
      Alert.alert('Error', 'Could not open dialer'),
    );
  };

  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() =>
      Alert.alert('Error', 'Could not open email client'),
    );
  };

  const openMaps = (address: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });
    Linking.openURL(url || '').catch(() =>
      Alert.alert('Error', 'Could not open maps'),
    );
  };

  const openChatSection = () => {
    const url = 'https://app.chatra.io/';
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          marginTop: Platform.OS == 'android' ? 20 : 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Image source={ImagePath.backClick} style={{width: 40, height: 40}} />
        </TouchableOpacity>
        <Text
          style={{
            ...commonStyles.font20navy,
            marginLeft: 20,
          }}>
          Support
        </Text>
      </View>
      <SizeBox size={10} />
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
            <Pressable onPress={() => openDialer(phone)}>
              <Text style={styles.phonetxt}>{phone}</Text>
            </Pressable>
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
            <Pressable onPress={() => openEmail(email)}>
              <Text style={styles.phonetxt}>{email}</Text>
            </Pressable>
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
            <Pressable onPress={() => openMaps(address)}>
              <Text style={styles.phonetxt}>{address}</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.chatButton}
        activeOpacity={0.8}
        onPress={openChatSection}>
        <Image source={ImagePath.chatiIcon} style={styles.image} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Support;
