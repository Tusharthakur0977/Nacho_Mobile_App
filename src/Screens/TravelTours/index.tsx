import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
import RBSheet from 'react-native-raw-bottom-sheet';
import {SvgUri} from 'react-native-svg';
import BedIcon from '../../Assets/Icons/bedIcon.svg';
import FlightIcon from '../../Assets/Icons/flight.svg';
import {setFiltersData as setFiltersDataRedux} from '../../Redux/Slices/HomeScreen/HomeScreenSlice';
import {useAppDispatch, useAppSelector} from '../../Redux/store';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import VectorIcon from '../../Utilities/Component/vectorIcons';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {
  fetchFilterProducts,
  fetchProducts,
} from '../../Utilities/Constants/requestHandler';
import {metaToArray, normalizeDuration} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  verticalScale,
} from '../../Utilities/Styles/responsiveSize';
import styles from './styles';

type FilterData = {
  title:
    | 'Country'
    | 'Durations'
    | 'Group Tour Date'
    | 'Year'
    | 'Special Events'
    | 'Self-Drive'
    | 'Cities';
  values: string[];
}[];
const buttons: {
  title: string;
  value: 'flight-and-land-packages' | 'no-flights';
}[] = [
  {title: 'Flight & Land Packages', value: 'flight-and-land-packages'},
  {title: 'Land Packages', value: 'no-flights'},
];

const FILTER_CATEGORIES = [
  'Country',
  'Duration',
  // 'Group Tour Date',
  'Year',
  'Special Events',
  'Self-Drive',
  'Cities',
];

const TravelTours = ({navigation, route}: any) => {
  const dispatch = useAppDispatch();
  const refRBSheet: any = useRef();
  const initialSearchQuery = route?.params?.searchQuery || '';

  const {user, isAuth, cartItems} = useAppSelector(state => state.user);
  const {filtersData: reduxFiltersData} = useAppSelector(state => state.home);

  const [selectedTab, setSelectedTab] = useState<
    'flight-and-land-packages' | 'no-flights'
  >('flight-and-land-packages');

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const [filterCategory, setFilterCategory] = useState<any>('Country');

  const [selectedOptions, setSelectedOptions] = useState<FilterData>([]);
  const [tempSelectedOptions, setTempSelectedOptions] = useState<FilterData>(
    [],
  );

  const [initialTours, setInitialTours] = useState<any[]>([]);
  const [filteredTours, setFilteredTours] = useState<any[]>([]);

  const [loadingMore, setLoadingMore] = useState(false);

  // Cache for products by collection handle
  const cacheRef = useRef<{[key: string]: any[]}>({});
  const loadingStateRef = useRef<{[key: string]: boolean}>({});

  // Collection handle mapping
  const collectionHandles: {[key: string]: string} = {
    'flight-and-land-packages': 'flight-and-land-packages',
    'no-flights': 'no-flights',
  };

  const handleTabPress = (name: 'flight-and-land-packages' | 'no-flights') => {
    if (selectedTab !== name) {
      setSelectedTab(name);
      setFilteredTours([]);
      loadProductsBatch(name); // Use new batch loading with caching
    }
  };

  const descriptions = {
    'flight-and-land-packages':
      'Flight and Land Packages differ from our other tours because they include round-trip airfare, have pre-set dates, and are group tours.',
    'no-flights':
      'Land Packages differ from our other tours as they do not include airfare. However, they do cover transportation, accommodation, a local guide, some meals, and various activities.',
  };

  // Apply local filters to products based on selected options
  const applyLocalFilters = (
    filters: FilterData,
    toursToFilter: any[] = initialTours,
  ) => {
    if (!filters || Object.keys(filters).length === 0) {
      return toursToFilter;
    }

    const filterMap = filters as any;

    return toursToFilter.filter(tour => {
      // Check country filter
      if (filterMap['country'] && filterMap['country'].length > 0) {
        const countryMatch = filterMap['country'].some((country: string) =>
          tour.tags?.includes(country),
        );
        if (!countryMatch) return false;
      }

      // Check duration filter
      if (filterMap['duration'] && filterMap['duration'].length > 0) {
        const durationMatch = filterMap['duration'].some((duration: string) =>
          tour.duration?.includes(duration),
        );
        if (!durationMatch) return false;
      }

      // Check year filter
      if (filterMap['year'] && filterMap['year'].length > 0) {
        const yearMatch = filterMap['year'].some((year: string) =>
          tour.years?.includes(year),
        );
        if (!yearMatch) return false;
      }

      // Check special events filter
      if (
        filterMap['special events'] &&
        filterMap['special events'].length > 0
      ) {
        const eventMatch = filterMap['special events'].some((event: string) =>
          tour.events?.includes(event),
        );
        if (!eventMatch) return false;
      }

      // Check self-drive filter
      if (filterMap['self-drive'] && filterMap['self-drive'].length > 0) {
        const selfDriveMatch = filterMap['self-drive'].some((option: string) =>
          option.toLowerCase() === 'yes'
            ? tour.selfDrive !== null
            : tour.selfDrive === null,
        );
        if (!selfDriveMatch) return false;
      }

      // Check cities filter
      if (filterMap['cities'] && filterMap['cities'].length > 0) {
        const cityMatch = filterMap['cities'].some((city: string) =>
          tour.cities?.includes(city),
        );
        if (!cityMatch) return false;
      }

      return true;
    });
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim().length === 0 ? query.trim() : query;
    setSearchQuery(trimmedQuery);

    if (trimmedQuery.length > 0) {
      const searchFiltered = initialTours.filter(tour => {
        const titleMatch =
          (tour.title &&
            tour.title.toLowerCase().includes(trimmedQuery.toLowerCase())) ||
          false;
        const countryMatch =
          (tour.country &&
            tour.country.toLowerCase().includes(trimmedQuery.toLowerCase())) ||
          false;
        const durationMatch =
          (tour.duration &&
            tour.duration.toLowerCase().includes(trimmedQuery.toLowerCase())) ||
          false;
        const citiesMatch =
          (tour.cities &&
            tour.cities.some((city: string) =>
              city.toLowerCase().includes(trimmedQuery.toLowerCase()),
            )) ||
          false;
        return titleMatch || countryMatch || citiesMatch || durationMatch;
      });
      setFilteredTours(searchFiltered);
    } else {
      setFilteredTours(initialTours);
    }
  };

  const renderPackagesCard = ({item}: any) => {
    if (
      item.title === 'N/A' ||
      item.duration === 'N/A' ||
      !item.imageUrl ||
      item.imageUrl === 'N/A'
    ) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.outerview}
        onPress={() => {
          navigation.navigate('PackageDetail', {id: item.id});
        }}
        activeOpacity={0.8}>
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
            {/* Best Seller Badge */}
            {item.bestSellerBadges && item.bestSellerBadges.length > 0 && (
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

            {/* Other Badges */}
            {item.otherBadges &&
              item.otherBadges.length > 0 &&
              item.otherBadges.map((badge: string, index: number) => (
                <View
                  key={`badge-${index}`}
                  style={{
                    paddingHorizontal: moderateScale(10),
                    paddingVertical: verticalScale(4),
                    backgroundColor:
                      badge === 'Select Your Own Dates' ||
                      badge === 'Select Your Own Date'
                        ? '#f4ce14'
                        : Colors.primaryblue,
                    borderRadius: 30,
                  }}>
                  <Text
                    style={{
                      color:
                        badge === 'Select Your Own Dates' ||
                        badge === 'Select Your Own Date'
                          ? Colors.black
                          : Colors.white,
                      fontSize: 10,
                    }}>
                    {badge}
                  </Text>
                </View>
              ))}
          </View>
          <View
            style={{
              gap: moderateScale(4),
              position: 'absolute',
              top: verticalScale(4),
              right: 4,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {selectedTab === 'flight-and-land-packages' && (
              <FlightIcon width={20} height={20} />
            )}
            <BedIcon width={20} height={20} />
            <SvgUri
              uri="https://evolution35.com/cdn/shop/files/activities_11d225fe-5346-4fad-8713-b436e4b01db4.svg?v=1745699894"
              width={20}
              height={20}
            />
          </View>

          <View style={styles.maintagscontainer}>
            {/* Display tour features */}
            {item?.tourFeatures
              // ?.filter(
              //   (tag: string) =>
              //     !/(days|nights)/i.test(tag) && !/and\s+more/i.test(tag),
              // )
              .map((tag: string, index: number) => (
                <View key={`feature-${index}`} style={styles.tagouterview}>
                  <Text style={{color: 'black', fontSize: 10}}>{tag}</Text>
                </View>
              ))}
          </View>
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
            <Text style={styles.daytxt}>{item.duration}</Text>
          </View>
          <TouchableOpacity
            style={styles.arrowcon}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('PackageDetail', {id: item?.id})
            }>
            <VectorIcon
              groupName="AntDesign"
              name="arrowright"
              size={26}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render filter options dynamically based on the selected category
  const renderFilterOptions = () => {
    let options: string[] = [];
    if (filterCategory === 'Country') {
      options = reduxFiltersData?.countries || [];
    } else if (filterCategory === 'Duration') {
      options = reduxFiltersData?.durations || [];
    } else if (filterCategory === 'Year') {
      options = reduxFiltersData?.years || [];
    } else if (filterCategory === 'Special Events') {
      options = reduxFiltersData?.events || [];
    } else if (filterCategory === 'Self-Drive') {
      options = reduxFiltersData?.self_drives || [];
    } else if (filterCategory === 'Cities') {
      options = reduxFiltersData?.cities || [];
    }
    return options.length > 0 ? (
      options.map((option: any, index: any) => (
        <TouchableOpacity
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
          }}
          onPress={() =>
            handleOptionSelect(option, filterCategory.toLowerCase())
          }>
          <Text
            style={{
              paddingLeft: 10,
              color: (
                tempSelectedOptions[filterCategory.toLowerCase()] as unknown as
                  | string[]
                  | undefined
              )?.includes(option)
                ? '#1276D1'
                : 'gray',
            }}>
            {option}
          </Text>
        </TouchableOpacity>
      ))
    ) : (
      <View
        style={{justifyContent: 'center', alignItems: 'center', padding: 30}}>
        <Text>No Filters Avaialble</Text>
      </View>
    );
  };

  const renderSelectedFilterTags = ({item}: any) => {
    return (
      <View key={`${item.key}-${item.value}`} style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.value}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            handleRemoveFilter(item.key, item.value);
          }}>
          <Image
            source={ImagePath.Cross}
            style={{
              height: 16,
              width: 16,
              borderRadius: 50,
              marginLeft: 5,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleRemoveFilter = (key: string, value: string) => {
    const updatedFilters: any = {...selectedOptions};

    if (updatedFilters[key]) {
      updatedFilters[key] = updatedFilters[key].filter(
        (item: string) => item !== value,
      );

      if (updatedFilters[key].length === 0) {
        delete updatedFilters[key];
      }
    }

    setSelectedOptions(updatedFilters);
    // Apply local filtering with updated filters
    const filtered = applyLocalFilters(updatedFilters, initialTours);
    setFilteredTours(filtered);
  };

  const handleOptionSelect = (option: string, key: string) => {
    setTempSelectedOptions(prevState => {
      const updatedFilters: any = {...prevState};

      // If the same option is already selected, deselect it
      if (updatedFilters[key]?.[0] === option) {
        delete updatedFilters[key];
      } else {
        // Replace with new single selection
        updatedFilters[key] = [option];
      }

      return updatedFilters;
    });
  };

  const handleApplyFilters = () => {
    setSelectedOptions(tempSelectedOptions);
    // Apply local filtering with selected filters
    const filtered = applyLocalFilters(tempSelectedOptions, initialTours);
    setFilteredTours(filtered);
    refRBSheet.current.close();
  };

  // Parse product data from GraphQL response
  const parseProductData = (edge: any) => {
    const node = edge.node;

    const countryTags = metaToArray(node.countryMetafield?.value);
    const yearTags = metaToArray(node.yearMetafield?.value);
    const eventTags = metaToArray(node.eventsMetafield?.value);
    const cityTags = metaToArray(node.citiesMetafield?.value);
    const durationTag = normalizeDuration(node.durationMetafield?.value);
    const selfDriveTag =
      node.selfDriveMetafield?.value === 'true' ? 'Self Drive' : null;
    if (node.title === 'Australia and New Zealand Travel Tour 426') {
    }
    const tags = [
      ...countryTags,
      ...(durationTag ? [durationTag] : []),
      ...yearTags,
      ...eventTags,
      ...cityTags,
      ...(selfDriveTag ? [selfDriveTag] : []),
    ];

    const price =
      node?.variants?.edges?.[0]?.node?.presentmentPrices?.edges?.[0]?.node
        ?.price?.amount || '0';

    return {
      id: node.id,
      title: node.title,
      imageUrl: node.images?.edges[0]?.node?.url || null,
      tags,
      country: countryTags[0] || '',
      duration: durationTag || '',
      years: yearTags,
      events: eventTags,
      cities: cityTags,
      selfDrive: selfDriveTag || null,
      price: price,
      tourFeatures: node?.tourFeatureMetafield?.value
        ? JSON.parse(node.tourFeatureMetafield.value)
        : [],
      bestSellerBadges: node?.bestSellerMetafield?.value
        ? node.bestSellerMetafield.value
        : [],
      otherBadges: node?.multiplebestSellerMetafield?.value
        ? JSON.parse(node.multiplebestSellerMetafield.value)
        : [],
    };
  };

  // Recursive batch loading function with caching
  const loadProductsBatchRecursive = async (
    handle: string,
    cursor: string | null = null,
    batchCount: number = 0,
    accumulatedProducts: any[] = [],
  ) => {
    try {
      const data = await fetchProducts(250, cursor, handle);
      const edges = data?.data?.collectionByHandle?.products?.edges || [];
      const pageInfo = data?.data?.collectionByHandle?.products?.pageInfo || {};

      // Parse and filter ACTIVE products
      const newProducts =
        edges
          ?.filter(
            (edge: any) =>
              edge.node.title !== 'GIFT CARD' && edge.node.status === 'ACTIVE',
          )
          ?.map((edge: any) => parseProductData(edge)) ?? [];

      const updatedProducts = [...accumulatedProducts, ...newProducts];
      batchCount += 1;

      // After 2 iterations (500 products), show the data
      if (batchCount === 2) {
        setInitialTours(updatedProducts);
        // Apply filters to newly loaded data
        const filtered = applyLocalFilters(selectedOptions, updatedProducts);
        setFilteredTours(filtered);
        setLoading(false); // Show data to user
      }

      // Continue loading in background if there's more data
      if (pageInfo.hasNextPage && pageInfo.endCursor) {
        setLoadingMore(true);
        setTimeout(() => {
          loadProductsBatchRecursive(
            handle,
            pageInfo.endCursor,
            batchCount,
            updatedProducts,
          ).finally(() => setLoadingMore(false));
        }, 0); // Non-blocking background load
      } else {
        // All products loaded - update cache
        cacheRef.current[handle] = updatedProducts;
        loadingStateRef.current[handle] = false;
        setInitialTours(updatedProducts);
        // Apply filters to all loaded data
        const filtered = applyLocalFilters(selectedOptions, updatedProducts);

        if (searchQuery.length > 0) {
          const searchFiltered = filtered.filter(tour => {
            const titleMatch =
              (tour.title &&
                tour.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
              false;
            const countryMatch =
              (tour.country &&
                tour.country
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())) ||
              false;
            const durationMatch =
              (tour.duration &&
                tour.duration
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())) ||
              false;
            const citiesMatch =
              (tour.cities &&
                tour.cities.some((city: string) =>
                  city.toLowerCase().includes(searchQuery.toLowerCase()),
                )) ||
              false;
            return titleMatch || countryMatch || durationMatch || citiesMatch;
          });
          setFilteredTours(searchFiltered);
        } else {
          setFilteredTours(filtered);
        }

        setLoading(false);
        setLoadingMore(false);
      }
    } catch (err) {
      console.error('Error loading products batch:', err);
      loadingStateRef.current[handle] = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadProductsBatch = async (
    activeTab?: 'flight-and-land-packages' | 'no-flights',
  ) => {
    const tab = activeTab || selectedTab;
    const handle = collectionHandles[tab];

    // Check if data is already cached
    if (cacheRef.current[handle] && cacheRef.current[handle].length > 0) {
      const cachedProducts = cacheRef.current[handle];
      setInitialTours(cachedProducts);
      // Apply filters to cached data
      const filtered = applyLocalFilters(selectedOptions, cachedProducts);

      if (searchQuery.length > 0) {
        const searchFiltered = filtered.filter(tour => {
          const titleMatch =
            (tour.title &&
              tour.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            false;
          const countryMatch =
            (tour.country &&
              tour.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
            false;
          const durationMatch =
            (tour.duration &&
              tour.duration
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            false;
          const citiesMatch =
            (tour.cities &&
              tour.cities.some((city: string) =>
                city.toLowerCase().includes(searchQuery.toLowerCase()),
              )) ||
            false;
          return titleMatch || countryMatch || durationMatch || citiesMatch;
        });
        setFilteredTours(searchFiltered);
      } else {
        setFilteredTours(filtered);
      }

      //   setFilteredTours(filtered);
      console.log(`Using cached data for ${handle}`);
      return; // Use cached data, no API call needed
    }

    // Prevent multiple simultaneous requests for the same handle
    if (loadingStateRef.current[handle]) {
      console.log(`Already loading ${handle}, skipping duplicate request`);
      return;
    }

    // Not cached, fetch from API
    console.log(`Fetching data for ${handle} from API`);
    setLoading(true);
    setFilteredTours([]);
    setInitialTours([]);
    loadingStateRef.current[handle] = true;

    await loadProductsBatchRecursive(handle, null, 0, []);
  };

  // Utility: Reset Filters
  const resetFilters = () => {
    setTempSelectedOptions([]);
    setFilteredTours(initialTours);
  };

  const fetchFiltersList = async () => {
    try {
      const data = await fetchFilterProducts();
      dispatch(setFiltersDataRedux(data));
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  useEffect(() => {
    setTempSelectedOptions(selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    loadProductsBatch(selectedTab); // Use new batch loading on initial mount
    fetchFiltersList();
  }, []);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // Apply initial search query when initialTours change or searchQuery changes
  useEffect(() => {
    // First apply selected filter options
    let filtered = applyLocalFilters(selectedOptions, initialTours);

    // Then apply search query filter on top of that
    if (searchQuery.trim().length > 0) {
      filtered = filtered.filter(tour => {
        const titleMatch =
          (tour.title &&
            tour.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          false;
        const countryMatch =
          (tour.country &&
            tour.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
          false;
        const durationMatch =
          (tour.duration &&
            tour.duration.toLowerCase().includes(searchQuery.toLowerCase())) ||
          false;
        const citiesMatch =
          (tour.cities &&
            tour.cities.some((city: string) =>
              city.toLowerCase().includes(searchQuery.toLowerCase()),
            )) ||
          false;

        return titleMatch || countryMatch || durationMatch || citiesMatch;
      });
    }

    setFilteredTours(filtered);
  }, [initialTours, searchQuery, selectedOptions]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.searchcon}>
        <VectorIcon
          groupName="AntDesign"
          name="search1"
          size={20}
          color={Colors.black}
        />
        <TextInput
          placeholder="Search Your Destination"
          placeholderTextColor={Colors.black}
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
      <SizeBox size={10} />
      <View style={styles.buttonscon}>
        {buttons.map((item, index) => (
          <TouchableOpacity
            disabled={loading}
            key={index}
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedTab === item.value
                    ? Colors.primaryblue
                    : Colors.white,
                opacity: selectedTab !== item.value && loading ? 0.6 : 1,
              },
            ]}
            onPress={() => handleTabPress(item.value)}>
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    selectedTab === item.value
                      ? Colors.white
                      : Colors.secondaryfont,
                },
              ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.descriptionview}>
        <Text
          style={{
            ...commonStyles.font12Regualar2,
            textAlign: 'center',
            color: Colors.secondaryfont,
          }}>
          {descriptions[selectedTab]}
        </Text>
      </View>

      {Object.keys(selectedOptions).length > 0 && (
        <>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.title, {marginLeft: 20}]}>Filters:</Text>
            <FlatList
              data={Object.entries(selectedOptions).flatMap(([key, values]) =>
                (values as unknown as string[]).map(value => ({key, value})),
              )}
              keyExtractor={(item, index) =>
                `${item.key}-${item.value}-${index}`
              }
              renderItem={renderSelectedFilterTags}
              contentContainerStyle={{
                paddingHorizontal: 10,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <SizeBox size={10} />
        </>
      )}
      {loading ? (
        <ActivityIndicator color={Colors.primaryblue} size="small" />
      ) : (
        <FlatList
          data={filteredTours}
          renderItem={renderPackagesCard}
          keyExtractor={(item, index) => item.id}
          extraData={selectedOptions}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 80}}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={{alignItems: 'center'}}>
              <Text>No Data Found.</Text>
            </View>
          }
          ListFooterComponent={
            loading ? (
              <View style={styles.loader}>
                <Text>Loading...</Text>
              </View>
            ) : null
          }
        />
      )}
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
            All Filters
          </Text>

          <Text
            onPress={resetFilters}
            style={{...commonStyles.font12, color: Colors.primaryblue}}>
            Clear All Filters
          </Text>
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{width: '30%'}}>
            {FILTER_CATEGORIES.map(item => (
              <TouchableOpacity
                key={item}
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  backgroundColor:
                    filterCategory === item ? 'white' : '#f0f0f0',
                  borderBottomWidth: 0.5,
                  borderColor: '#ccc',
                }}
                onPress={() => {
                  setFilterCategory(item);
                }}>
                <Text
                  style={{
                    ...commonStyles.font12Regualar2,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{width: '90%'}}>{renderFilterOptions()}</View>
          </ScrollView>
        </View>
        <SizeBox size={10} />

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
            onPress={handleApplyFilters}
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

export default TravelTours;
