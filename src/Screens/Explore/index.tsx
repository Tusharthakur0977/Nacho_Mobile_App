import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';

import {useIsFocused} from '@react-navigation/native';
import {useAppSelector} from '../../Redux/store';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import VectorIcon from '../../Utilities/Component/vectorIcons';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {
  fetchCollectionsData,
  fetchFilterProducts,
  fetchProducts,
} from '../../Utilities/Constants/requestHandler';
import {Colors} from '../../Utilities/Styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  verticalScale,
} from '../../Utilities/Styles/responsiveSize';
import styles from './styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import commonStyles from '../../Utilities/Styles/commonStyles';

const {height} = Dimensions.get('window');

// Define interfaces for type safety
interface ProductNode {
  id: string;
  title: string;
  images?: {edges: Array<{node: {url: string}}>};
  metafield?: {type: string};
  durationMetafield?: {value: string};
  countryMetafield?: {value: string};
  yearMetafield?: {value: string};
  eventsMetafield?: {value: string};
  selfDriveMetafield?: {value: string};
  tourFeatureMetafield?: {value: string};
}

interface ProductEdge {
  node: ProductNode;
  cursor: string;
}

interface Product {
  id: string;
  title: string;
  imageUrl: string | null;
  type?: string;
  duration?: string;
  country?: string | null;
  year?: string | null;
  event?: string | null;
  selfDrive?: string | null;
  tourFeatureMetafield?: any;
  isBestSeller?: boolean;
  otherFields?: any;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

const safeParseJSON = (value: string | null, fallback: any) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value)?.[0] ?? fallback;
  } catch {
    console.warn(`Failed to parse JSON: ${value}`);
    return fallback;
  }
};

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const Explore = ({navigation}: any) => {
  const refRBSheet: any = useRef();

  const isFocused = useIsFocused();
  const {cartItems} = useAppSelector(state => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [allTours, setAllTours] = useState<Product[]>([]);
  const [filteredTours, setFilteredTours] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mostBoughtPackages, setMostBoughtPackages] = useState([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [filtersData, setFiltersData] = useState<any>([]);
  const [selectedFilterCountry, setSelectedFilterCountry] = useState<
    string | null
  >(null);

  const metaToArray = (val?: string | null): string[] => {
    if (!val) return [];
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String);
      if (parsed == null) return [];
      return [String(parsed)];
    } catch {
      // not JSON, return as single value
      return [String(val)];
    }
  };

  const normalizeDuration = (val?: string | null): string | null => {
    if (!val) return null;
    // if it already contains day/night text, don’t append "Days"
    if (/\bday|night/i.test(val)) return val;
    return `${val} Days`;
  };

  const applySearchFilter = (tours: Product[], query: string) => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return tours;

    return tours.filter(tour => {
      const titleMatch =
        (tour.title && tour.title.toLowerCase().includes(searchTerm)) || false;
      const durationMatch =
        (tour.duration && tour.duration.toLowerCase().includes(searchTerm)) ||
        false;
      const countryMatch =
        (tour.country && tour.country.toLowerCase().includes(searchTerm)) ||
        false;
      return titleMatch || durationMatch || countryMatch;
    });
  };

  // Fetch most bought packages
  const fetchMostBoughtPackages = useCallback(async () => {
    try {
      const mostBoughtData = await fetchProducts(12);
      const mostBoughtList =
        mostBoughtData?.data?.collectionByHandle?.products?.edges
          ?.filter(
            (edge: any) =>
              edge.node.title !== 'GIFT CARD' && edge.node.status === 'ACTIVE',
          )
          ?.slice(0, 12)
          ?.map((edge: any) => {
            const node = edge.node;

            const countryTags = metaToArray(node.countryMetafield?.value);
            const yearTags = metaToArray(node.yearMetafield?.value);
            const eventTags = metaToArray(node.eventsMetafield?.value);
            const durationTag = normalizeDuration(
              node.durationMetafield?.value,
            );
            const selfDriveTag =
              node.selfDriveMetafield?.value === 'true' ? 'Self Drive' : null;

            const tags = [
              ...countryTags,
              ...(durationTag ? [durationTag] : []),
              // ...yearTags,
              ...eventTags,
              ...(selfDriveTag ? [selfDriveTag] : []),
            ];

            return {
              id: node.id,
              title: node.title,
              imageUrl: node.images?.edges[0]?.node?.url || null,
              tags,
              // (optional) if you also need this for other spots
              tourFeatureMetafield: node?.tourFeatureMetafield?.value
                ? JSON.parse(node.tourFeatureMetafield.value)
                : [],
            };
          }) ?? [];

      setMostBoughtPackages(mostBoughtList);
    } catch (err) {
      console.error('Error loading most bought packages:', err);
    }
  }, []);

  // Fetch tour products with pagination
  const fetchTourProducts = useCallback(
    async (afterCursor: string | null = null, append: boolean = false) => {
      if (!hasNextPage && afterCursor) return;

      try {
        setIsFetchingMore(true);
        const collectionsData = await fetchCollectionsData(100, afterCursor);

        // Extract pageInfo and edges
        const pageInfo: PageInfo = collectionsData?.data?.products
          ?.pageInfo ?? {
          hasNextPage: false,
          endCursor: null,
        };
        const edges: ProductEdge[] =
          collectionsData?.data?.products?.edges ?? [];

        // Process filtered tours
        const products: Product[] = edges.reduce(
          (acc: Product[], edge: ProductEdge | any) => {
            if (!edge.node.title.startsWith('Optional')) return acc;

            const product: Product = {
              id: edge.node.id,
              title: edge.node.title,
              type: edge.node.metafield?.type ?? 'flight',
              imageUrl: edge.node.images?.edges[0]?.node?.url ?? null,
              duration: edge.node.durationMetafield?.value,
              country: safeParseJSON(edge.node.countryMetafield?.value, null),
              year: safeParseJSON(edge.node.yearMetafield?.value, null),
              event: safeParseJSON(edge.node.eventsMetafield?.value, null),
              selfDrive: safeParseJSON(
                edge.node.selfDriveMetafield?.value,
                null,
              ),
              tourFeatureMetafield: edge.node.tourFeatureMetafield?.value
                ? JSON.parse(edge.node.tourFeatureMetafield.value)
                : null,
              isBestSeller: !!edge.node?.bestSellerMetafield,
              otherFields: edge.node.multiplebestSellerMetafield?.value
                ? JSON.parse(edge.node.multiplebestSellerMetafield.value)
                : [],
            };
            acc.push(product);
            return acc;
          },
          [],
        );

        // Process collection data
        const newCollectionData = edges
          .filter((edge: ProductEdge) => edge.node.title !== 'GIFT CARD')
          .map((edge: ProductEdge) => edge);

        // Update state while ensuring no duplicates based on id
        setAllTours(prev => {
          const existingIds = new Set(prev.map(tour => tour.id));
          const newUniqueProducts = products.filter(
            product => !existingIds.has(product.id),
          );
          const updatedTours = append
            ? [...prev, ...newUniqueProducts]
            : newUniqueProducts;

          setFilteredTours(
            searchQuery.trim().length > 0
              ? applySearchFilter(updatedTours, searchQuery)
              : updatedTours,
          );

          return updatedTours;
        });

        setCollectionData(prev => {
          const existingIds = new Set(prev.map(edge => edge.node.id));
          const newUniqueCollectionData = newCollectionData.filter(
            edge => !existingIds.has(edge.node.id),
          );
          return append
            ? [...prev, ...newUniqueCollectionData]
            : shuffleArray(newUniqueCollectionData);
        });

        setCursor(pageInfo.endCursor);
        setHasNextPage(pageInfo.hasNextPage);
      } catch (err) {
        console.error('Error loading tour products:', err);
      } finally {
        setIsFetchingMore(false);
      }
    },
    [hasNextPage, searchQuery],
  );

  // Load more data
  const loadMoreData = useCallback(() => {
    if (searchQuery.trim().length > 0) {
      return;
    }

    if (!isFetchingMore && hasNextPage && cursor) {
      fetchTourProducts(cursor, true);
    }
  }, [isFetchingMore, hasNextPage, cursor, searchQuery]);

  // Main data loader
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchMostBoughtPackages(),
        fetchTourProducts(null, false), // Initial fetch with null cursor
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const trimmed = query.trim();

    if (trimmed.length > 0) {
      setFilteredTours(applySearchFilter(allTours, query));
    } else {
      setFilteredTours(allTours);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setFilteredTours(applySearchFilter(allTours, searchQuery));
    } else {
      setFilteredTours(allTours);
    }
  }, [allTours, searchQuery]);

  const renderTourList = ({item}: any) => {
    if (
      item.title === 'N/A' ||
      item.duration === 'N/A' ||
      !item.imageUrl ||
      item.imageUrl === 'N/A'
    ) {
      return null;
    }
    // console.log(item.otherFields, 'SSSS');

    const otherMultipleBadges =
      item.otherFields && item.otherFields.length > 0
        ? item.otherFields.value
        : [];

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.outerview}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('PackageDetail', {id: item.id, isOptional: true});
        }}>
        <ImageBackground
          source={item.imageUrl ? {uri: item.imageUrl} : ImagePath.City}
          style={{
            height: Platform.OS === 'ios' ? height / 4.5 : height / 4,
            width: '100%',
          }}
          borderRadius={5}>
          <View
            style={{
              gap: moderateScale(4),
              position: 'absolute',
              top: verticalScale(4),
              left: 4,
              alignItems: 'flex-start',
            }}>
            {item.isBestSeller && (
              <View
                style={{
                  paddingHorizontal: moderateScale(10),
                  paddingVertical: verticalScale(4),
                  backgroundColor: Colors.primaryblue,
                  borderRadius: 30,
                }}>
                <Text style={{color: Colors.white, fontSize: 10}}>
                  Best Seller
                </Text>
              </View>
            )}

            {otherMultipleBadges &&
              otherMultipleBadges.length > 0 &&
              otherMultipleBadges.map((fields: string) => (
                <View
                  style={{
                    paddingHorizontal: moderateScale(10),
                    paddingVertical: verticalScale(4),
                    backgroundColor: Colors.primaryblue,
                    borderRadius: 30,
                  }}>
                  <Text style={{color: Colors.white, fontSize: 10}}>
                    {fields}
                  </Text>
                </View>
              ))}
          </View>

          {item?.tourFeatureMetafield && (
            <View style={styles.maintagscontainer}>
              {item?.tourFeatureMetafield?.map((tag: string, index: number) => (
                <View key={`duration-${index}`} style={styles.tagouterview}>
                  <Text style={{color: 'black'}}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </ImageBackground>
        <SizeBox size={5} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flex: 1, flexShrink: 1}}>
            <Text style={styles.traveltxt} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
          <TouchableOpacity
            key={item.id}
            style={styles.arrowcon}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('PackageDetail', {
                id: item.id,
                isOptional: true,
              });
            }}>
            <VectorIcon
              groupName="AntDesign"
              name="arrowright"
              size={25}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const SwiperItem = useCallback(
    ({item}: {item: any}) => {
      const [localImgLoad, setLocalImgLoad] = useState(false); // Move state inside SwiperItem

      return (
        <View style={styles.cardContainer}>
          <ImageBackground
            source={{uri: item?.imageUrl || ImagePath.City}} // Add fallback image
            style={styles.image}
            resizeMode="cover"
            onLoadStart={() => setLocalImgLoad(true)}
            onLoadEnd={() => setLocalImgLoad(false)}
            imageStyle={{borderRadius: 20}}>
            <View style={styles.daytxt}>
              <Text style={styles.title}>{item?.title}</Text>
            </View>

            {item?.tags?.length > 0 && (
              <View
                style={[
                  styles.maintagscontainer,
                  {marginBottom: moderateScaleVertical(30)},
                ]}>
                {item.tags.map((tag: string, index: number) => (
                  <View key={`tag-${index}`} style={styles.tagouterview}>
                    <Text style={{color: 'black'}}>{tag}</Text>
                  </View>
                ))}
                <View style={styles.tagouterview}>
                  <Text style={{color: 'black'}}>Select Your Own Dates</Text>
                </View>
              </View>
            )}
            {localImgLoad && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator color={Colors.primaryblue} size="large" />
              </View>
            )}
          </ImageBackground>
        </View>
      );
    },
    [], // No dependencies since localImgLoad is internal
  );

  const renderCountries = () => {
    const countryValues = filtersData.countries;

    if (countryValues) {
      return countryValues.map((country: string) => (
        <TouchableOpacity
          key={country}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: '#f0f0f0',
            borderBottomWidth: 0.5,
            borderColor: '#ccc',
          }}
          onPress={() => {
            setSelectedFilterCountry(country);
          }}>
          <Text
            style={{
              ...commonStyles.font12Regualar2,
              color: selectedFilterCountry === country ? '#1276D1' : 'gray',
            }}>
            {country}
          </Text>
        </TouchableOpacity>
      ));
    }
  };

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    return () => {
      searchQuery.trim().length > 0 && handleSearch('');
      setSearchQuery('');
    };
  }, [isFocused]);

  useEffect(() => {
    const fetchFiltersList = async () => {
      try {
        const data = await fetchFilterProducts();

        setFiltersData(data);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchFiltersList();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, paddingVertical: 10}}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={Colors.primaryblue} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <Text style={[styles.username, {fontSize: 18}]}>
            Our Most Bought Packages
          </Text>
          <SizeBox size={10} />
          <View>
            <Swiper
              showsButtons={false}
              loop
              autoplay
              autoplayTimeout={5}
              showsPagination={true}
              paginationStyle={{bottom: 10}}
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
              containerStyle={styles.swiperContainer}
              removeClippedSubviews={false}
              onIndexChanged={() => {}}
              loadMinimal={true}
              loadMinimalSize={2}>
              {mostBoughtPackages.map((item: any) => (
                <SwiperItem key={item.id} item={item} />
              ))}
            </Swiper>
          </View>
          <SizeBox size={20} />
          <ImageBackground
            source={ImagePath.Blueback}
            resizeMode="stretch"
            style={{
              height: moderateScale(254),
              width: '100%',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
                alignSelf: 'center',
                height: '100%',
              }}>
              <Text style={styles.preferencetxt}>
                Want To Travel According To Your Preferences
              </Text>
              <SizeBox size={5} />
              <Text style={styles.promtxt}>
                Plan your perfect getaway—your way! Choose your dream
                destination, set your dates, pick your hotels, customize
                activities, and tailor every detail for an unforgettable trip!
              </Text>
              <SizeBox size={10} />
              <TouchableOpacity
                style={styles.tripplan}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('PlanTrip')}>
                <Text style={styles.promtxt}>Plan Your Own Trip</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <SizeBox size={20} />
          <View style={styles.searchcon}>
            <VectorIcon
              groupName="AntDesign"
              name="search1"
              size={20}
              color={Colors.black}
            />
            <TextInput
              placeholder="Search by Country, Destination"
              placeholderTextColor={Colors.greyTxt}
              style={styles.input}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <View style={styles.separator} />
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
            </TouchableOpacity>
          </View>
          <SizeBox size={20} />
          <View style={styles.promotionalcon}>
            <Text style={[styles.preferencetxt, {color: Colors.navyblue}]}>
              Day Tours
            </Text>
          </View>
          <SizeBox size={10} />
          <FlatList
            initialNumToRender={10}
            data={filteredTours}
            renderItem={renderTourList}
            keyExtractor={(item, index) => item.title + index.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={{alignItems: 'center'}}>
                <Text>No Data Found.</Text>
              </View>
            }
            ListFooterComponent={() =>
              isFetchingMore ? (
                <ActivityIndicator size="small" color={Colors.primaryblue} />
              ) : (
                <SizeBox size={65} />
              )
            }
          />
        </ScrollView>
      )}

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
      <RBSheet
        ref={refRBSheet}
        height={500}
        openDuration={300}
        customStyles={{
          container: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            padding: 0,
            backgroundColor: Colors.white,
            marginBottom: 20,
          },
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}>
          <Text
            style={{
              ...commonStyles.font12Regular,
              color: Colors.secondaryfont,
            }}>
            Select Country
          </Text>

          <Text
            onPress={() => {
              setSelectedFilterCountry(null);
            }}
            style={{...commonStyles.font12, color: Colors.primaryblue}}>
            Clear Country Filter
          </Text>
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{}}>{renderCountries()}</View>
          </ScrollView>
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderTopWidth: 0.5,
            borderTopColor: Colors.lightGrey,
          }}>
          <TouchableOpacity
            onPress={() => refRBSheet.current.close()}
            style={{
              flex: 1,
              backgroundColor: Colors.secondaryfont,
              paddingVertical: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.filtertxt}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleSearch(selectedFilterCountry || '');
              refRBSheet.current.close();
            }}
            style={{
              flex: 1,
              backgroundColor: Colors.primaryblue,
              paddingVertical: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.filtertxt}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Explore;
