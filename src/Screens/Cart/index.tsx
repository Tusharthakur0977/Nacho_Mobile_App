import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import VectorIcon from '../../Utilities/Component/vectorIcons';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {
  getCart,
  updateItemInCart,
} from '../../Utilities/Constants/requestHandler';
import STORAGE_KEYS from '../../Utilities/Constants/StorageKeys';
import {getData, storeData} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {width} from '../../Utilities/Styles/responsiveSize';
import styles from './style';
import {useAppDispatch} from '../../Redux/store';
import {setCartItems} from '../../Redux/Slices/UserSlice/UserSlice';
import {useIsFocused} from '@react-navigation/native';

const Cart = ({navigation}: any) => {
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const [updatedCartData, setUpdatedCartData] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const updateItemsInCart = async (cartLineID: any, quantity: number) => {
    setLoadingItemId(cartLineID);
    const userEmail = await getData(STORAGE_KEYS.userEmail);
    const cartList = await getData(STORAGE_KEYS.cartList);
    const cart = cartList.filter(
      (item: {userEmail: string; cartID: string}) => {
        return item.userEmail.trim() === userEmail?.trim();
      },
    )[0];
    const cartID = cart.cartID;
    updateItemInCart(cartID, cartLineID, quantity)
      .then(res => {
        console.log(JSON.stringify(res));
        getCartDataHandler();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoadingItemId(null); // hide loader
      });
  };

  const increaseQuantity = (id: string, qty: number) => {
    updateItemsInCart(id, qty + 1);
  };

  const decreaseQuantity = (id: string, qty: number) => {
    updateItemsInCart(id, qty - 1);
  };

  const getCartDataHandler = async () => {
    const userEmail = await getData(STORAGE_KEYS.userEmail);
    const cartList = await getData(STORAGE_KEYS.cartList);

    if (!cartList) {
      console.log('cart id is not available');
      setUpdatedCartData([]);
      setCheckoutUrl('');
      return;
    }

    const cart = cartList.filter(
      (item: {userEmail: string; cartID: string}) => {
        return item.userEmail.trim() === userEmail?.trim();
      },
    )[0];
    if (!cart) {
      console.log('No cart found for the user');
      setUpdatedCartData([]);
      setCheckoutUrl('');
      return;
    }
    const cartID = cart.cartID;
    try {
      const res = await getCart(cartID);
      console.log(JSON.stringify(res.cart.lines.edges), 'SSJDKS');

      if (res?.cart) {
        const formattedCartData = res.cart.lines.edges.map(({node}: any) => {
          // Helper function to safely extract date components
          const getDateString = (title: string) => {
            try {
              if (!title || typeof title !== 'string') {
                return '-';
              }
              const parts = title.split(' / ')[0]; // Get first part before ' / '
              if (!parts) return '-';
              const dateRange = parts.split(' - ');
              if (dateRange.length !== 2) return '-';
              // Process start date
              const startParts = dateRange[0].split(' ');
              if (startParts.length !== 3) return '-';
              // Process end date
              const endParts = dateRange[1].split(' ');
              if (endParts.length !== 3) return '-';
              return `${startParts[0]} ${startParts[1].slice(0, 3)} ${
                startParts[2]
              } - ${endParts[0]} ${endParts[1].slice(0, 3)} ${endParts[2]}`;
            } catch (error) {
              return '-';
            }
          };

          const customDate = node.attributes.find(
            (attr: any) => attr.key === 'Tour dates',
          );

          const customRoomOccupancy = node.attributes.find(
            (attr: any) => attr.key === 'Room Occupancy',
          );

          const customRoom = node.attributes.find(
            (attr: any) => attr.key === 'Room',
          );

          return {
            id: node.id,
            title: node?.merchandise?.product?.title || '-',
            price: `₹${node?.merchandise?.price?.amount || '0'}`,
            date: customDate
              ? customDate.value
              : getDateString(node?.merchandise?.title),
            roomOccupancy: customRoomOccupancy
              ? customRoomOccupancy.value
              : node?.merchandise?.title?.split(' / ')[1] || '-',
            room: customRoom
              ? customRoom.value
              : node?.merchandise?.title?.split(' / ')[2] || '-',
            total: `₹${
              (node.merchandise?.price?.amount || 0) * (node.quantity || 1)
            }`,
            quantity: node.quantity || 1,
            imageUrl:
              node?.merchandise?.product?.images?.edges[0]?.node?.url || '',
            isCustom: !!customDate,
          };
        });

        await storeData(STORAGE_KEYS.cartItems, res.cart.lines.edges.length);
        dispatch(setCartItems(res.cart.lines.edges.length));
        setUpdatedCartData(formattedCartData);
        setCheckoutUrl(res?.cart?.checkoutUrl);
      } else {
        console.error('Cart data not found in response');
      }
    } catch (err) {
      console.error('Error fetching cart data:', err);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getCartDataHandler();
    }
  }, [isFocused]);

  const renderItem = ({item}: any) => {
    return (
      <View
        style={{
          width: '100%',
          borderRadius: 10,
          marginBottom: 10,
          position: 'relative',
        }}>
        {loadingItemId === item.id && (
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(34, 33, 33, 0.22)',
              zIndex: 2,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <ActivityIndicator size="large" color={Colors.primaryblue} />
          </View>
        )}
        <View style={styles.outercon}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: item.imageUrl}}
                style={{width: 58, height: 58, borderRadius: 5}}
              />
              <View style={{paddingHorizontal: 15}}>
                <Text
                  numberOfLines={1}
                  style={{...commonStyles.font14Regular, width: width / 3}}>
                  {item?.title}
                </Text>
                <Text
                  style={{...commonStyles.font12}}>{`$${item?.price?.replace(
                  '₹',
                  '',
                )}`}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => decreaseQuantity(item?.id, item.quantity)}>
                <VectorIcon
                  groupName="Feather"
                  name="minus-circle"
                  size={20}
                  color={Colors.primaryblue}
                />
              </TouchableOpacity>
              <Text style={styles.quentitytxt}>{item?.quantity}</Text>
              <TouchableOpacity
                onPress={() => increaseQuantity(item?.id, item.quantity)}>
                <VectorIcon
                  groupName="Feather"
                  name="plus-circle"
                  size={20}
                  color={Colors.primaryblue}
                />
              </TouchableOpacity>
            </View>
          </View>
          <SizeBox size={5} />
          {item.date !== '-' && (
            <View style={styles.row}>
              <Text style={styles.keyText}>
                {item.isCustom ? 'Tour Date' : 'Group Tour Date'}:
              </Text>
              <Text style={styles.valueText}>{item?.date}</Text>
            </View>
          )}

          {item?.roomOccupancy !== '-' && (
            <View style={styles.row}>
              <Text style={styles.keyText}>Room Occupancy</Text>
              <Text style={styles.valueText}>{item?.roomOccupancy}</Text>
            </View>
          )}
          {item?.room !== '-' && (
            <View style={styles.row}>
              <Text style={styles.keyText}>Room</Text>
              <Text style={styles.valueText}>{item?.room}</Text>
            </View>
          )}

          <SizeBox size={5} />
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: Colors.gentlegrey,
            }}
          />
          <SizeBox size={5} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{...commonStyles.font12}}>Total</Text>
            <Text style={{...commonStyles.font14}}>{`$${item?.total?.replace(
              '₹',
              '',
            )}`}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loader) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color={Colors.primaryblue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: Platform.OS == 'android' ? 20 : 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Image
              source={ImagePath.backClick}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
          <Text
            style={{
              ...commonStyles.font20navy,
              marginLeft: 20,
            }}>
            Cart
          </Text>
        </View>
        <SizeBox size={10} />
        <FlatList
          data={updatedCartData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListFooterComponent={() => <SizeBox size={40} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={{...commonStyles.font14Center, color: Colors.black}}>
              No Data Available
            </Text>
          )}
        />
      </View>
      {updatedCartData.length > 0 && (
        <View style={styles.button}>
          <View>
            <Text
              style={{...commonStyles.font12Regualar2, fontStyle: 'italic'}}>
              Total Amount{' '}
            </Text>
            <Text style={{...commonStyles.font16White}}>
              $
              {updatedCartData.reduce(
                (total, item) =>
                  total + parseFloat(item?.total?.replace('₹', '')),
                0,
              )}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.booknowbtn}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('WaverForm', {checkOut: checkoutUrl})
            }>
            <Text style={{...commonStyles.font14Center}}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;
