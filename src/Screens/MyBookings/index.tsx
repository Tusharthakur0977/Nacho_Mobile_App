import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {fetchMyBookings} from '../../Utilities/Constants/requestHandler';
import STORAGE_KEYS from '../../Utilities/Constants/StorageKeys';
import {getData} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {height} from '../../Utilities/Styles/responsiveSize';
import styles from './style';

const MyBookings = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const [bookingsData, setBookingsData] = useState<any[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const accessToken = await getData(STORAGE_KEYS.accessToken);

    try {
      const bookingsDetail = await fetchMyBookings(accessToken);
      setLoading(false);

      if (bookingsDetail && bookingsDetail.length > 0) {
        const formattedBookings = bookingsDetail.map((booking: any) => {
          const firstItem = booking.node;
          const lineItem = firstItem.lineItems.edges[0]?.node;
          return {
            id: booking.node.id,
            title: lineItem?.title,
            duration: new Date(booking.node.processedAt).toLocaleDateString(),
            price:
              booking.node.totalPrice.amount +
              ' ' +
              booking.node.totalPrice.currencyCode,
            status: booking.node.financialStatus,
            image: lineItem?.variant?.image?.url,
          };
        });

        setBookingsData(formattedBookings);
      } else {
        setBookingsData([]);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching Booking:', error);
      setBookingsData([]);
    }
  };

  const renderTourList = ({item}: any) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.outerview}>
      <ImageBackground
        source={{uri: item.image}}
        style={{height: height / 4, width: '100%'}}
        borderRadius={5}
      />
      <SizeBox size={5} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text style={styles.traveltxt}>{item.title}</Text>
          <Text>
            Processed on : <Text style={styles.daytxt}>{item.duration}</Text>
          </Text>
          <Text>
            Price : <Text style={styles.daytxt}>{item.price}</Text>
          </Text>
          <Text>
            Status : <Text style={styles.daytxt}>{item.status}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primaryblue} />
      </View>
    );
  }
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
          My Bookings
        </Text>
      </View>
      <SizeBox size={5} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View>
          {bookingsData.length === 0 ? (
            <Text
              style={{
                ...commonStyles.font14Center,
                color: Colors.navyblue,
                marginTop: height / 3,
              }}>
              No data found
            </Text>
          ) : (
            <FlatList
              data={bookingsData}
              renderItem={renderTourList}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => <SizeBox size={20} />}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBookings;
