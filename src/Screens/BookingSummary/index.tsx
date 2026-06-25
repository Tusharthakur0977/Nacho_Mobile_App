import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import React from 'react';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {height} from '../../Utilities/Styles/responsiveSize';
import styles from './style';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {Colors} from '../../Utilities/Styles/colors';

const BookingSummary = ({navigation}: any) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, backgroundColor: Colors.white}}>
          <ImageBackground
            source={ImagePath.jahaaj}
            style={{width: '100%', height: height / 2.7}}>
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
            <View style={styles.profilecon}>
              <Text style={{...commonStyles.font20navy}}>
                Japan Travel Tour 282
              </Text>
              <SizeBox size={5} />
              <View style={styles.countryimgcon}>
                <Image
                  source={ImagePath.Onboarding}
                  style={{width: 17, height: 17, borderRadius: 20}}
                />
                <Text style={styles.countrytxt}>Japan</Text>
              </View>
              <SizeBox size={8} />
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Text style={styles.datetxt}>Dates</Text>
                  <SizeBox size={3} />
                  <View style={styles.txtouterview}>
                    <Text style={styles.dates}>24 Dec 2024 - 31 Dec 2024</Text>
                  </View>
                </View>
                <View style={{paddingLeft: 15}}>
                  <Text style={styles.datetxt}>Quantity</Text>
                  <SizeBox size={3} />
                  <View style={styles.txtouterview}>
                    <Text style={styles.dates}>10</Text>
                  </View>
                </View>
              </View>
              <SizeBox size={10} />
              <Text style={styles.placeserveytxt}>
                Explore Japan with our expert local guides! This 18-day,
                17-night tour includes hotel accommodations, some meals, and
                guided activities. With an English/Japanese-speaking guide,
                you'll experience seamless travel and unforgettable adventures.
                Pricing is consistent for departures from any major U.S. city.
                Please note that all schedules are approximate and may vary.
              </Text>
              <SizeBox size={10} />
              <Text style={styles.overviewtxt}>Overview</Text>
              <SizeBox size={5} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={ImagePath.Flight}
                    style={{height: 13, width: 16, resizeMode: 'contain'}}
                  />
                  <Text
                    style={[styles.dates, {fontWeight: '500', marginLeft: 10}]}>
                    Duration
                  </Text>
                </View>
                <Text style={styles.dayphase}>9 Days, 8 Nights</Text>
              </View>
              <SizeBox size={5} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={ImagePath.Flight}
                    style={{height: 13, width: 16, resizeMode: 'contain'}}
                  />
                  <Text
                    style={[styles.dates, {fontWeight: '500', marginLeft: 10}]}>
                    Airfare
                  </Text>
                </View>
                <Text style={styles.dayphase}>Included</Text>
              </View>
              <SizeBox size={5} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={ImagePath.Flight}
                    style={{height: 13, width: 16, resizeMode: 'contain'}}
                  />
                  <Text
                    style={[styles.dates, {fontWeight: '500', marginLeft: 10}]}>
                    Hotels
                  </Text>
                </View>
                <Text style={styles.dayphase}>Included</Text>
              </View>
              <SizeBox size={5} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={ImagePath.Flight}
                    style={{height: 13, width: 16, resizeMode: 'contain'}}
                  />
                  <Text
                    style={[styles.dates, {fontWeight: '500', marginLeft: 10}]}>
                    Local Guide
                  </Text>
                </View>
                <Text style={styles.dayphase}>
                  English / Japanese Guide Included
                </Text>
              </View>
              <SizeBox size={5} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={ImagePath.Flight}
                    style={{height: 13, width: 16, resizeMode: 'contain'}}
                  />
                  <Text
                    style={[styles.dates, {fontWeight: '500', marginLeft: 10}]}>
                    Activities
                  </Text>
                </View>
                <Text style={styles.dayphase}>Included</Text>
              </View>
              <SizeBox size={5} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={ImagePath.Flight}
                    style={{height: 13, width: 16, resizeMode: 'contain'}}
                  />
                  <Text
                    style={[styles.dates, {fontWeight: '500', marginLeft: 10}]}>
                    Meals
                  </Text>
                </View>
                <Text style={styles.dayphase}>Some Meals Included</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingSummary;
