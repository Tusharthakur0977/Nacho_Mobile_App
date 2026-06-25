import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  setFiltersData as setFiltersDataRedux,
  setHomeScreenData,
  setSuggestedTours,
} from '../../Redux/Slices/HomeScreen/HomeScreenSlice';
import {Node, SuggestedToursData} from '../../Redux/Slices/HomeScreen/type';
import {
  setCartItems,
  setIsAuth,
  setUserData,
} from '../../Redux/Slices/UserSlice/UserSlice';
import {useAppDispatch, useAppSelector} from '../../Redux/store';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import VectorIcon from '../../Utilities/Component/vectorIcons';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {
  fetchFilterProducts,
  fetchHomeScreenData,
  fetchProducts,
  fetchProfileData,
  getCart,
} from '../../Utilities/Constants/requestHandler';
import STORAGE_KEYS from '../../Utilities/Constants/StorageKeys';
import {getData, storeData} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  verticalScale,
  width,
} from '../../Utilities/Styles/responsiveSize';
import styles from './style';

// Skeleton Loader Component
const SkeletonLoader = ({width, height, borderRadius = 10}: any) => (
  <View
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: '#E0E0E0',
      overflow: 'hidden',
    }}>
    <View
      style={{
        flex: 1,
        backgroundColor: '#F5F5F5',
        opacity: 0.6,
      }}
    />
  </View>
);

const HomeScreen = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const {user, isAuth, cartItems} = useAppSelector(state => state.user);

  const {
    HomeScreenData,
    suggestedTours,
    filtersData: reduxFiltersData,
  } = useAppSelector(state => state.home);

  const [searchQuery, setSearchQuery] = useState('');
  const [homeDataLoading, setHomeDataLoading] = useState(!HomeScreenData);
  const [suggestedToursLoading, setSuggestedToursLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getCartDataHandler = async () => {
      const userEmail = await getData(STORAGE_KEYS.userEmail);
      const cartList = await getData(STORAGE_KEYS.cartList);

      if (!cartList) {
        console.log('cart id is not available');
        return;
      }

      const cart = cartList.filter(
        (item: {userEmail: string; cartID: string}) => {
          return item.userEmail.trim() === userEmail?.trim();
        },
      )[0];
      if (!cart) {
        console.log('No cart found for the user');
        return;
      }
      const cartID = cart.cartID;

      try {
        const res = await getCart(cartID);

        if (res?.cart) {
          await storeData(STORAGE_KEYS.cartItems, res.cart.lines.edges.length);
          dispatch(setCartItems(res.cart.lines.edges.length));
        } else {
          console.error('Cart data not found in response');
        }
      } catch (err) {
        console.error('Error fetching cart data:', err);
      }
    };

    const fetchFiltersList = async () => {
      try {
        setFiltersLoading(true);
        const data = await fetchFilterProducts();
        dispatch(setFiltersDataRedux(data));
      } catch (err) {
        console.error('Error fetching filters:', err);
      } finally {
        setFiltersLoading(false);
      }
    };

    const fetchHomeData = async () => {
      // Only fetch if HomeScreenData is not already in Redux or on refresh
      if (!HomeScreenData || refreshing) {
        try {
          setHomeDataLoading(true);
          const data: {
            countries: Node[];
            suggestedTours: Node[];
            others: Node[];
          } = await fetchHomeScreenData();
          if (data) {
            dispatch(setHomeScreenData(data));
          }
        } catch (err) {
          console.error('Error fetching home data:', err);
        } finally {
          setHomeDataLoading(false);
        }
      }
    };

    const fetchSuggestedTour = async () => {
      try {
        setSuggestedToursLoading(true);
        const response = await fetchProducts(250, null, 'group-travel-tours');
        const tours: SuggestedToursData = response.data;

        if (
          tours.collectionByHandle.products.edges &&
          tours.collectionByHandle.products.edges.length > 0
        ) {
          dispatch(
            setSuggestedTours(
              tours.collectionByHandle.products.edges.map(item => item.node),
            ),
          );
        }
      } catch (err) {
        console.error('Error fetching suggested tours:', err);
      } finally {
        setSuggestedToursLoading(false);
      }
    };

    const fetchAuthenticationData = async () => {
      const storedToken = await getData(STORAGE_KEYS.accessToken);
      const storedEmail = await getData(STORAGE_KEYS.userEmail);

      if (storedToken && storedEmail) {
        dispatch(setIsAuth(true));
      } else {
        dispatch(setIsAuth(false));
      }
    };

    const fetchProfile = async () => {
      try {
        const userEmail = await getData(STORAGE_KEYS.userEmail);

        if (userEmail) {
          const data = await fetchProfileData(userEmail);
          if (data.data?.customers?.edges[0]?.node) {
            dispatch(setUserData(data.data?.customers?.edges[0]?.node));
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    const initializeScreen = async () => {
      await Promise.all([
        fetchHomeData(),
        fetchSuggestedTour(),
        getCartDataHandler(),
        fetchProfile(),
        fetchAuthenticationData(),
        fetchFiltersList(),
      ]);
    };

    initializeScreen();
  }, [HomeScreenData, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchFilterProducts().then(data => dispatch(setFiltersDataRedux(data))),
        fetchHomeScreenData().then(data => {
          if (data) dispatch(setHomeScreenData(data));
        }),
        fetchProducts(250, null, 'group-travel-tours').then(response => {
          const tours: SuggestedToursData = response.data;
          if (
            tours.collectionByHandle.products.edges &&
            tours.collectionByHandle.products.edges.length > 0
          ) {
            dispatch(
              setSuggestedTours(
                tours.collectionByHandle.products.edges.map(item => item.node),
              ),
            );
          }
        }),
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {homeDataLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
          <ActivityIndicator size="small" color={Colors.primaryblue} />
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primaryblue}
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: verticalScale(70),
          }}>
          <View style={styles.txtimgcon}>
            <View>
              {isAuth ? (
                <Text style={styles.username}>Hello {user?.firstName} !</Text>
              ) : (
                <Text style={styles.username}>Guest !</Text>
              )}
              <Text style={styles.welcometxt}>Welcome to Evolution35</Text>
            </View>
            {isAuth ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Profile')}>
                <Image
                  source={ImagePath.logoOnly}
                  style={{
                    height: moderateScaleVertical(41),
                    width: moderateScale(41),
                    borderRadius: 50,
                    resizeMode: 'cover',
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Profile')}>
                <VectorIcon
                  color={Colors.primaryblue}
                  groupName="FontAwesome"
                  name="user-circle"
                  size={40}
                />
              </TouchableOpacity>
            )}
          </View>
          <SizeBox size={10} />

          <ImageBackground
            source={ImagePath.homeBgForSearch}
            style={{
              width: width,
              height: height * 0.3,
              justifyContent: 'center',
              alignItems: 'center',
              gap: verticalScale(10),
            }}>
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}
            />
            <Text
              style={{
                fontSize: 28,
                fontFamily: fontFamily.bold,
                color: Colors.white,
              }}>
              Travel with
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: fontFamily.bold,
                  color: '#2D91EC',
                }}>
                Evolution35
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fontFamily.medium,
                color: Colors.white,
                width: width * 0.8,
                textAlign: 'center',
              }}>
              We don’t plan trips. We design stories — meaningful journeys that
              stay with you long after you return home.
            </Text>
            <View style={styles.searchcon}>
              <TextInput
                placeholder="Search Your Destination"
                placeholderTextColor={Colors.black}
                style={styles.input}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={() => {
                  if (searchQuery.trim().length > 0) {
                    navigation.navigate('TravelTours', {
                      searchQuery: searchQuery,
                    });
                    setSearchQuery('');
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (searchQuery.trim().length > 0) {
                    navigation.navigate('TravelTours', {
                      searchQuery: searchQuery,
                    });
                    setSearchQuery('');
                  }
                }}
                style={{
                  backgroundColor: '#2D91EC',
                  height: '85%',
                  paddingHorizontal: moderateScale(30),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 30,
                }}
                activeOpacity={0.7}>
                <Text
                  style={{fontFamily: fontFamily.bold, color: Colors.white}}>
                  Search
                </Text>
              </TouchableOpacity>

              {/* <View style={styles.separator} />
          <TouchableOpacity
            style={styles.filterIconContainer}
            activeOpacity={0.8}
            onPress={() => refRBSheet.current.open()}>
            <Image
              source={ImagePath.Filter}
              style={{
                height: moderateScaleVertical(16),
                width: moderateScale(16),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity> */}
            </View>
          </ImageBackground>

          <SizeBox size={10} />
          <View style={{gap: verticalScale(20)}}>
            <View style={{padding: moderateScale(10), gap: verticalScale(10)}}>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fontFamily.bold,
                    color: Colors.black,
                  }}>
                  Journey Beyond Limits and{' '}
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: fontFamily.bold,
                      color: Colors.primaryblue,
                    }}>
                    Expectations
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fontFamily.regular,
                    color: Colors.textgrey,
                  }}>
                  Discover extraordinary destinations and immersive experiences
                  crafted to inspire, delight, and take you far beyond the
                  ordinary journey.
                </Text>
              </View>

              {homeDataLoading ? (
                <FlatList
                  data={[1, 2, 3]}
                  horizontal
                  contentContainerStyle={{
                    columnGap: verticalScale(10),
                  }}
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={() => (
                    <View style={{gap: verticalScale(5)}}>
                      <SkeletonLoader
                        width={width * 0.43}
                        height={height * 0.23}
                      />
                      <SkeletonLoader width={width * 0.43} height={16} />
                    </View>
                  )}
                />
              ) : HomeScreenData?.countries ? (
                <FlatList
                  data={HomeScreenData.countries}
                  horizontal
                  contentContainerStyle={{
                    columnGap: verticalScale(10),
                  }}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Collection', {
                            handle: item.handle,
                            title: item.title,
                          })
                        }
                        activeOpacity={0.7}>
                        <View style={{gap: verticalScale(5)}}>
                          <Image
                            source={{uri: item.image?.originalSrc}}
                            style={{
                              height: height * 0.23,
                              width: width * 0.43,
                              borderRadius: 10,
                            }}
                          />
                          <Text
                            style={{fontFamily: fontFamily.bold, fontSize: 14}}>
                            {item.title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : null}
            </View>
            <View style={{padding: moderateScale(10), gap: verticalScale(10)}}>
              <View style={{}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fontFamily.bold,
                    color: Colors.black,
                  }}>
                  Suggested{' '}
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: fontFamily.bold,
                      color: Colors.primaryblue,
                    }}>
                    Destinations
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fontFamily.regular,
                    color: Colors.textgrey,
                  }}>
                  Every journey is uniquely crafted for your style and passion.
                </Text>
              </View>

              {suggestedToursLoading ? (
                <FlatList
                  data={[1, 2, 3]}
                  horizontal
                  contentContainerStyle={{
                    columnGap: verticalScale(10),
                  }}
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={() => (
                    <View
                      style={{
                        gap: verticalScale(5),
                        alignItems: 'center',
                        width: width * 0.4,
                      }}>
                      <SkeletonLoader
                        width={width * 0.4}
                        height={height * 0.23}
                      />
                      <SkeletonLoader width={width * 0.35} height={14} />
                    </View>
                  )}
                />
              ) : suggestedTours && suggestedTours.length > 0 ? (
                <FlatList
                  data={suggestedTours}
                  horizontal
                  contentContainerStyle={{
                    columnGap: verticalScale(10),
                  }}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('PackageDetail', {id: item.id});
                        }}
                        style={{
                          gap: verticalScale(5),
                          alignItems: 'center',
                          width: width * 0.4,
                        }}>
                        <Image
                          source={{uri: item.images.edges[0].node.url}}
                          style={{
                            height: height * 0.23,
                            width: width * 0.4,
                            borderRadius: 10,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: fontFamily.bold,
                            fontSize: 14,
                            textAlign: 'center',
                          }}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : null}
            </View>
            <View style={{padding: moderateScale(10), gap: verticalScale(10)}}>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: fontFamily.bold,
                    color: Colors.black,
                  }}>
                  Every Kind of Tour,{' '}
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: fontFamily.bold,
                      color: Colors.primaryblue,
                    }}>
                    for Every Kind of Traveler
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: fontFamily.regular,
                    color: Colors.textgrey,
                  }}>
                  Discover a variety of travel experiences designed for every
                  interest and style. Find the perfect trip that matches how you
                  love to explore.
                </Text>
              </View>

              {homeDataLoading ? (
                <FlatList
                  data={[1, 2, 3, 4]}
                  numColumns={2}
                  contentContainerStyle={{
                    rowGap: verticalScale(10),
                  }}
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={{
                          gap: verticalScale(5),
                          alignItems: 'center',
                          width: '50%',
                        }}>
                        <SkeletonLoader
                          width={width * 0.45}
                          height={height * 0.2}
                        />
                        <SkeletonLoader width={width * 0.4} height={14} />
                      </View>
                    );
                  }}
                />
              ) : HomeScreenData?.others ? (
                <FlatList
                  data={HomeScreenData.others}
                  numColumns={2}
                  contentContainerStyle={{
                    rowGap: verticalScale(10),
                  }}
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Collection', {
                            handle: item.handle,
                            title: item.title,
                          });
                        }}
                        style={{
                          gap: verticalScale(5),
                          alignItems: 'center',
                          width: '50%',
                        }}>
                        <Image
                          source={{uri: item.image?.originalSrc}}
                          style={{
                            height: height * 0.2,
                            width: width * 0.45,
                            borderRadius: 10,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: fontFamily.bold,
                            fontSize: 14,
                            textAlign: 'center',
                          }}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : null}
            </View>
            <SizeBox size={20} />

            <View style={{padding: moderateScale(10), gap: verticalScale(25)}}>
              <Image
                source={ImagePath.AboutUsImage}
                style={{
                  resizeMode: 'contain',
                  width: '100%',
                  height: height * 0.25,
                }}
              />
              <View
                style={{
                  paddingHorizontal: moderateScale(20),
                  gap: verticalScale(10),
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fontFamily.medium,
                    color: Colors.LinearBlack,
                    paddingVertical: verticalScale(5),
                    paddingHorizontal: moderateScale(15),
                    backgroundColor: '#97cdffa5',
                    alignSelf: 'flex-start',
                    borderRadius: 100,
                  }}>
                  25+ years of experience
                </Text>

                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: fontFamily.bold,
                    color: Colors.black,
                  }}>
                  About{' '}
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: fontFamily.bold,
                      color: '#2D91EC',
                    }}>
                    Evolution35
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fontFamily.regular,
                  }}>
                  Evolution 35 stands as a testament to the timeless art of
                  travel, boasting over 25 years of dedicated service in the
                  industry. With a rich history rooted in crafting unforgettable
                  journeys, this travel agency excels in transforming dreams
                  into realities. Specializing in personalized itineraries,
                  Evolution 35 has cultivated an extensive network of global
                  connections, ensuring that each trip is as seamless and
                  enriching as possible.
                </Text>
              </View>
            </View>
          </View>

          <SizeBox size={25} />
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
