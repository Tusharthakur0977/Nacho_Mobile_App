import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RBSheet from 'react-native-raw-bottom-sheet';
import {SvgUri} from 'react-native-svg';
import BedIcon from '../../Assets/Icons/bedIcon.svg';
import FlightIcon from '../../Assets/Icons/flight.svg';
import {useAppSelector} from '../../Redux/store';
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
import fontFamily from '../../Utilities/Styles/fontFamily';
import {
  height,
  moderateScale,
  verticalScale,
} from '../../Utilities/Styles/responsiveSize';
import styles from './style';

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

const FILTER_CATEGORIES = [
  'Country',
  'Duration',
  'Year',
  'Special Events',
  'Self-Drive',
  'Cities',
];

const SearchScreen = ({navigation, route}: any) => {
  const refRBSheet: any = useRef();
  const initialSearchQuery = route?.params?.searchQuery || '';

  // Get filters data from Redux
  const {filtersData: reduxFiltersData} = useAppSelector(state => state.home);

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedTab, setSelectedTab] = useState<
    'flight-and-land-packages' | 'no-flights'
  >('flight-and-land-packages');
  const [loading, setLoading] = useState(false);
  const [filteredTours, setFilteredTours] = useState<any[]>([]);
  const [initialTours, setInitialTours] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  // Cache for products by collection handle
  const cacheRef = useRef<{[key: string]: any[]}>({});
  const loadingStateRef = useRef<{[key: string]: boolean}>({});
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Collection handle mapping
  const collectionHandles: {[key: string]: string} = {
    'flight-and-land-packages': 'flight-and-land-packages',
    'no-flights': 'no-flights',
  };

  // Filter states
  const [filterCategory, setFilterCategory] = useState<any>('Country');
  const [selectedOptions, setSelectedOptions] = useState<FilterData>([]);
  const [tempSelectedOptions, setTempSelectedOptions] = useState<FilterData>(
    [],
  );
  const [filtersData, setFiltersData] = useState<any>(reduxFiltersData || {});

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer (300ms delay)
    debounceTimerRef.current = setTimeout(() => {
      if (query.trim().length > 0) {
        const filtered = initialTours.filter(tour => {
          const titleMatch =
            (tour.title &&
              tour.title.toLowerCase().includes(query.toLowerCase())) ||
            false;
          const countryMatch =
            (tour.country &&
              tour.country.toLowerCase().includes(query.toLowerCase())) ||
            false;
          const durationMatch =
            (tour.duration &&
              tour.duration.toLowerCase().includes(query.toLowerCase())) ||
            false;
          const citiesMatch =
            (tour.cities &&
              tour.cities.some((city: string) =>
                city.toLowerCase().includes(query.toLowerCase()),
              )) ||
            false;
          return titleMatch || countryMatch || durationMatch || citiesMatch;
        });
        setFilteredTours(filtered);
      } else {
        setFilteredTours(initialTours);
      }
    }, 300);
  };

  const performSearch = async () => {
    if (searchQuery.trim().length === 0) {
      return;
    }
    await loadProductsBatch(searchQuery);
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
      bestSellerBadges: node?.multiplebestSellerMetafield?.value
        ? JSON.parse(node.multiplebestSellerMetafield.value)
        : [],
    };
  };

  // Recursive batch loading function with caching
  const loadProductsBatchRecursive = async (
    handle: string,
    searchTerm: string,
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
        // Filter and display after 2 batches
        let displayedProducts = updatedProducts;
        if (searchTerm.trim().length > 0) {
          displayedProducts = updatedProducts.filter((tour: any) => {
            const titleMatch =
              (tour.title &&
                tour.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
              false;
            const countryMatch =
              (tour.country &&
                tour.country
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())) ||
              false;
            const citiesMatch =
              (tour.cities &&
                tour.cities.some((city: string) =>
                  city.toLowerCase().includes(searchTerm.toLowerCase()),
                )) ||
              false;
            return titleMatch || countryMatch || citiesMatch;
          });
        }

        setInitialTours(updatedProducts);
        setFilteredTours(displayedProducts);
        setLoading(false); // Show data to user
      }

      // Continue loading in background if there's more data
      if (pageInfo.hasNextPage && pageInfo.endCursor) {
        setLoadingMore(true);
        setTimeout(() => {
          loadProductsBatchRecursive(
            handle,
            searchTerm,
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
        // Apply search filter to all loaded data
        let displayedProducts = updatedProducts;
        if (searchTerm.trim().length > 0) {
          displayedProducts = updatedProducts.filter((tour: any) => {
            const titleMatch =
              (tour.title &&
                tour.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
              false;
            const countryMatch =
              (tour.country &&
                tour.country
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())) ||
              false;
            const durationMatch =
              (tour.duration &&
                tour.duration
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())) ||
              false;
            const citiesMatch =
              (tour.cities &&
                tour.cities.some((city: string) =>
                  city.toLowerCase().includes(searchTerm.toLowerCase()),
                )) ||
              false;
            return titleMatch || countryMatch || durationMatch || citiesMatch;
          });
        }
        setFilteredTours(displayedProducts);
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
    searchTerm: string,
    activeTab?: 'flight-and-land-packages' | 'no-flights',
  ) => {
    const tab = activeTab || selectedTab;
    const handle = collectionHandles[tab];

    // Check if data is already cached
    if (cacheRef.current[handle] && cacheRef.current[handle].length > 0) {
      const cachedProducts = cacheRef.current[handle];
      setInitialTours(cachedProducts);

      // Filter cached data by search term
      if (searchTerm.trim().length > 0) {
        const filtered = cachedProducts.filter((tour: any) => {
          const titleMatch =
            (tour.title &&
              tour.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            false;
          const countryMatch =
            (tour.country &&
              tour.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
            false;
          const durationMatch =
            (tour.duration &&
              tour.duration.toLowerCase().includes(searchTerm.toLowerCase())) ||
            false;
          const citiesMatch =
            (tour.cities &&
              tour.cities.some((city: string) =>
                city.toLowerCase().includes(searchTerm.toLowerCase()),
              )) ||
            false;
          return titleMatch || countryMatch || durationMatch || citiesMatch;
        });
        setFilteredTours(filtered);
      } else {
        setFilteredTours(cachedProducts);
      }
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

    await loadProductsBatchRecursive(handle, searchTerm, null, 0, []);
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

    const otherMultipleBadges = item.otherFields
      ? JSON.parse(item.otherFields.value)
      : [];

    return (
      <TouchableOpacity
        style={styles.outerview}
        onPress={() => {
          navigation.navigate('PackageDetail', {id: item.id});
        }}
        activeOpacity={0.8}>
        <Image
          source={item.imageUrl ? {uri: item.imageUrl} : ImagePath.City}
          style={{
            height: Platform.OS === 'ios' ? height / 4.5 : height / 4,
            width: '100%',
            borderRadius: 5,
          }}
        />
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
            otherMultipleBadges.map((fields: string, index: number) => (
              <View
                key={index}
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
          {item?.tourFeatureMetafield
            ?.filter(
              (tag: string) =>
                !/(days|nights)/i.test(tag) && !/and\s+more/i.test(tag),
            )
            .map((tag: string, index: number) => (
              <View key={`duration-${index}`} style={styles.tagouterview}>
                <Text style={{color: 'black', fontSize: 10}}>{tag}</Text>
              </View>
            ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
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

  const renderFilterOptions = () => {
    let options = [];
    if (filterCategory === 'Country') {
      options = filtersData.countries || [];
    } else if (filterCategory === 'Duration') {
      options = filtersData.durations || [];
    } else if (filterCategory === 'Year') {
      options = filtersData.years || [];
    } else if (filterCategory === 'Special Events') {
      options = filtersData.events || [];
    } else if (filterCategory === 'Self-Drive') {
      options = filtersData.self_drives || [];
    } else if (filterCategory === 'Cities') {
      options = filtersData.cities || [];
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
        <Text>No Filters Available</Text>
      </View>
    );
  };

  const handleOptionSelect = (option: string, key: string) => {
    setTempSelectedOptions(prevState => {
      const updatedFilters: any = {...prevState};

      if (updatedFilters[key]?.[0] === option) {
        delete updatedFilters[key];
      } else {
        updatedFilters[key] = [option];
      }

      return updatedFilters;
    });
  };

  const handleApplyFilters = () => {
    setSelectedOptions(tempSelectedOptions);
    let filters = {
      country: '',
      year: '',
      event: '',
      duration: '',
      drive: '',
      city: '',
    };

    for (const [key, value] of Object.entries(tempSelectedOptions)) {
      switch (key) {
        case 'country':
          filters.country = (value as any)[0] || '';
          break;
        case 'self-drive':
          filters.drive = (value as any)[0] || '';
          break;
        case 'duration':
          filters.duration = (value as any)[0] || '';
          break;
        case 'year':
          filters.year = (value as any)[0] || '';
          break;
        case 'special events':
          filters.event = (value as any)[0] || '';
          break;
        case 'cities':
          filters.city = (value as any)[0] || '';
          break;
      }
    }

    loadProductsBatch(searchQuery, selectedTab);
    refRBSheet.current.close();
  };

  const resetFilters = () => {
    setTempSelectedOptions([]);
    setSelectedOptions([]);
  };

  useEffect(() => {
    setTempSelectedOptions(selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    // Use filters from Redux if available, otherwise fetch
    if (reduxFiltersData) {
      setFiltersData(reduxFiltersData);
    } else {
      const fetchFiltersList = async () => {
        try {
          const data = await fetchFilterProducts();
          setFiltersData(data);
        } catch (err) {
          console.error('Error fetching filters:', err);
        }
      };
      fetchFiltersList();
    }
  }, [reduxFiltersData]);

  useEffect(() => {
    loadProductsBatch(searchQuery, selectedTab);
  }, [selectedTab]);

  // Re-apply search filter when initialTours or searchQuery changes (e.g., on tab switch)
  // This effect handles search when data loads, not user typing
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = initialTours.filter(tour => {
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
      setFilteredTours(filtered);
    } else {
      setFilteredTours(initialTours);
    }
  }, [initialTours, searchQuery]);

  // Cleanup debounce timer on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView
        extraScrollHeight={100}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 15,
            marginTop: Platform.OS === 'android' ? 15 : 10,
            alignItems: 'center',
            marginBottom: 15,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={{marginRight: 10}}>
            <Image
              source={ImagePath.backClick}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.white,
              borderRadius: 25,
              height: 45,
              borderWidth: 1,
              borderColor: Colors.gentlegrey,
            }}>
            <TextInput
              placeholder="Search Your Destination"
              placeholderTextColor={Colors.greyTxt}
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 12,
                color: Colors.black,
              }}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity
            onPress={performSearch}
            activeOpacity={0.7}
            style={{marginLeft: 10}}>
            <VectorIcon
              groupName="AntDesign"
              name="search1"
              size={20}
              color={Colors.primaryblue}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            activeOpacity={0.7}
            style={{marginLeft: 10}}>
            <VectorIcon
              groupName="AntDesign"
              name="filter"
              size={20}
              color={Colors.primaryblue}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: moderateScale(10),
            paddingHorizontal: 15,
            marginVertical: 15,
          }}>
          {[
            {
              title: 'Flight & Land Packages',
              value: 'flight-and-land-packages',
            },
            {title: 'Land Packages', value: 'no-flights'},
          ].map((item, index) => (
            <TouchableOpacity
              disabled={loading}
              key={index}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 20,
                backgroundColor:
                  selectedTab === item.value
                    ? Colors.primaryblue
                    : Colors.gentlegrey,
                opacity: selectedTab !== item.value && loading ? 0.6 : 1,
              }}
              onPress={() => {
                setSelectedTab(
                  item.value as 'flight-and-land-packages' | 'no-flights',
                );
              }}>
              <Text
                style={{
                  color:
                    selectedTab === item.value
                      ? Colors.white
                      : Colors.secondaryfont,
                  textAlign: 'center',
                  fontSize: 12,
                  fontFamily: fontFamily.medium,
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Colors.primaryblue} />
          </View>
        ) : filteredTours.length > 0 ? (
          <FlatList
            data={filteredTours}
            renderItem={renderPackagesCard}
            keyExtractor={(item, index) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{paddingHorizontal: 15}}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: Colors.secondaryfont,
                textAlign: 'center',
              }}>
              No tours found matching "{searchQuery}"
            </Text>
          </View>
        )}
      </KeyboardAwareScrollView>

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
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                fontFamily: fontFamily.medium,
              }}>
              Close
            </Text>
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
            <Text
              style={{
                color: Colors.white,
                fontSize: 14,
                fontFamily: fontFamily.medium,
              }}>
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default SearchScreen;
