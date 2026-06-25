import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {SvgUri} from 'react-native-svg';
import Swiper from 'react-native-swiper';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useAppSelector} from '../../Redux/store';
import CustomDateButton from '../../Utilities/Component/CustomDateButton';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import VectorIcon from '../../Utilities/Component/vectorIcons';
import ImagePath from '../../Utilities/Constants/ImagePath';
import NavigationStrings from '../../Utilities/Constants/NavigationStrings';
import {
  addToCart,
  createCart,
  fetchItineraryMetaobject,
  fetchMultipleMetaData,
  fetchProductDetails,
  getMediaImageById,
  GetMultipleProductsDetail,
} from '../../Utilities/Constants/requestHandler';
import STORAGE_KEYS from '../../Utilities/Constants/StorageKeys';
import {getCurrencySymbol} from '../../Utilities/currencyUtils';
import {
  calculateRegion,
  extractYouTubeVideoID,
  formatCurrency,
  formatPrice,
  getData,
  storeData,
} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  verticalScale,
  width,
} from '../../Utilities/Styles/responsiveSize';
import {ProductVariants, VariantNode} from '../../Utilities/types/ApirRepsonse';
import {metaData, Root2} from '../../Utilities/types/fetchMultipleMetaData';
import styles from './style';
import {OptionalTours} from '../../Utilities/types/fetchOptionalToursTypes';

const dataButtons = [
  {key: 'itinerary', label: 'Itinerary at a glance'},
  {key: 'highlights', label: 'Tour highlights'},
  {key: 'Your Tour Includes', label: 'Your Tour Includes'},
  {key: 'Travel Tips', label: 'Travel Tips'},
  {key: 'FAQs', label: 'FAQs'},
];

const columns = ['Room Occupancy', 'Single', 'Double', 'Triple', 'Quadruple'];

const GOOGLE_MAPS_APIKEY = 'AIzaSyCDZoRf-BZL2yR_ZyXpzht_a63hMgLCTis';

const PackageDetail = ({navigation, route}: any) => {
  const {isAuth} = useAppSelector(state => state.user);

  const packageID = route?.params?.id;
  const isOptionalTour = route?.params?.isOptional;

  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [tourHighlights, setTourHighlights] = useState(
    isOptionalTour ? dataButtons[1].key : dataButtons[0].key,
  );
  const [visibleText, setVisibleText] = useState<{[key: string]: boolean}>({});
  const [faqsText, setFaqsText] = useState<{[key: string]: boolean}>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>({});
  const [overviewlist, setOverviewlist] = useState<any>([]);
  const [overviewDescription, setOverviewDescription] = useState<string>('');

  const [glanceData, setGlanceData] = useState<any[]>([]);
  const [highlightsData, setHighlightsData] = useState<any[]>([]);
  const [includedTour, setIncludedTour] = useState<any[]>([]);
  const [tourTrip, setTourTrip] = useState<any[]>([]);
  const [faqData, setFaqData] = useState<any[]>([]);
  const [rowdata, setRowData] = useState<any>([]);
  const [airFareTrans, setAirFareTrans] = useState<any>({});
  const [crosolImages, setCrosolImages] = useState<any[]>([]);
  const [accommodationDes, setAccommodationDes] = useState('');
  const [accommodationImg, setAccommodationImg] = useState('');
  const [accommodationTitle, setAccommodationTitle] = useState('');
  const [hotelType, setHotelType] = useState('');
  const [accCity, setAccCity] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [pin, setPin] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const [locationData, setLocationData] = useState({
    latitude: '',
    longitude: '',
  });

  const [itenaryData, setItenaryData] = useState<any>([]);
  const [itenaryIds, setItenaryIds] = useState([]);
  const [expandedItems, setExpandedItems] = useState<any>({});
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);

  const [itineraryImageMetaIds, setItineraryImageMetaIds] = useState([]);
  const [itineraryImageData, setItineraryImageData] = useState<metaData>([]);

  const [topSvgIconIds, setTopSvgIconIds] = useState<string[]>([]);
  const [topIconsData, setTopIconsData] = useState<
    {title: string; iconUrl: string}[]
  >([]);

  const [youtubelinks, setYoutubelinks] = useState<string[] | null>(null);

  const [youtubeModalVisible, setYoutbeModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [airfareCarouselIndex, setAirfareCarouselIndex] = useState(0);
  const [optionalTourIds, setOptionalTourIds] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [customDateRange, setCustomDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [durationOfDays, setDurationOfDays] = useState<null | {
    days: number;
    nights: number;
  }>(null);
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [selectedCustomDate, setSelectedCustomDate] = useState(null);

  // Product Variants
  const [productVariants, setProductVariants] = useState<ProductVariants>([]);
  const [selectedVariant, setSelectedVariant] = useState<VariantNode | null>(
    null,
  );

  const [selectedOccupancy, setSelectedOccupancy] = useState<string | null>(
    null,
  );
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const [showSelectOccupancyModal, setShowSelectOccupancyModal] =
    useState(false);
  const [showSelectRoomModal, setShowSelectRoomModal] = useState(false);

  const [allOptionToursAvailableIds, setAllOptionToursAvailableIds] = useState<
    string[]
  >([]);
  const [allOptionTourMerchandiseID, setAllOptionTourMerchandiseID] = useState<
    string[]
  >([]);

  const [allOptionalToursData, setAllOptionalToursData] = useState<
    OptionalTours[]
  >([]);

  const [selectedOptionalTours, setSelectedOptionalTours] = useState<string[]>(
    [],
  );

  const [selectedOptionalToursVariants, setSelectedOptionalToursVariants] =
    useState<{tourId: string; variantId: string}[]>([]);

  // Extract all unique occupancies
  const occupancies = useMemo(() => {
    const occSet = new Set();
    productVariants.forEach(item => {
      const parts = item.node.title.split(' / ');
      occSet.add(parts[2]); // e.g. "Single Occupancy"
    });
    return Array.from(occSet);
  }, [productVariants]);

  const rooms = useMemo(() => {
    const roomsSet = new Set();
    productVariants.forEach(item => {
      const parts = item.node.title.split(' / ');
      roomsSet.add(parts[1]); // e.g. "Per Person"
    });
    return Array.from(roomsSet);
  }, [productVariants]);

  // Function to handle thumbnail press
  const handleThumbnailPress = (videoId: string) => {
    setSelectedVideoId(videoId);
    setYoutbeModalVisible(true);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedVideoId(null);
    setYoutbeModalVisible(false);
  };

  // Checkbox component for optional tours
  const CheckboxItem = ({
    checked,
    onPress,
    label,
    tourId,
    variants,
    selectedVariantId,
    onVariantSelect,
  }: {
    checked: boolean;
    onPress: () => void;
    label: string;
    tourId: string;
    variants: any;
    selectedVariantId: string | null;
    onVariantSelect: (variantId: string) => void;
  }) => {
    const variantsList = variants?.edges || [];
    const hasMultipleVariants = variantsList.length > 1;

    return (
      <View
        style={{
          borderWidth: 0.7,
          borderColor: Colors.greyTxt,
          borderRadius: 10,
          padding: 10,
        }}>
        <TouchableOpacity
          onPress={onPress}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={[
              {
                width: 16,
                height: 16,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.black,
                backgroundColor: Colors.white,
                justifyContent: 'center',
                alignItems: 'center',
              },
              checked && {
                backgroundColor: Colors.primaryblue,
                borderColor: Colors.primaryblue,
              },
            ]}>
            {checked && (
              <Text
                style={{color: Colors.white, fontSize: 14, fontWeight: 'bold'}}>
                ✓
              </Text>
            )}
          </View>

          <Text style={{marginLeft: 8, fontSize: 14, color: Colors.black}}>
            Include
          </Text>
          <Text
            style={{marginLeft: 8, fontSize: 14, color: Colors.primaryblue}}>
            {label}
          </Text>
        </TouchableOpacity>

        {checked && hasMultipleVariants && (
          <View style={{marginTop: 10}}>
            <Text
              style={{fontSize: 12, color: Colors.greyTxt, marginBottom: 8}}>
              Select Options:
            </Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
              {variantsList.map((variant: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    {
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: Colors.greyTxt,
                      backgroundColor: Colors.white,
                    },
                    selectedVariantId === variant?.node.id && {
                      backgroundColor: Colors.primaryblue,
                      borderColor: Colors.primaryblue,
                    },
                  ]}
                  onPress={() => onVariantSelect(variant?.node?.id)}>
                  <Text
                    style={[
                      {fontSize: 12, color: Colors.black},
                      selectedVariantId === variant?.node?.id && {
                        color: Colors.white,
                        fontWeight: '600',
                      },
                    ]}>
                    {variant?.node?.title} - $
                    {
                      variant?.node?.presentmentPrices?.edges[1]?.node?.price
                        ?.amount
                    }
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const toggleExpand = (index: number) => {
    setExpandedItems((prev: any) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLanguageButtons = (id: string) => {
    setFaqsText(prevState => ({
      ...prevState,
      [id]: prevState[id] === true ? false : true,
    }));
  };

  const buttons = isOptionalTour
    ? dataButtons.filter(item => item.key !== 'itinerary')
    : dataButtons;

  const getAccommodationId = (rawValue: string) => {
    if (!rawValue) return '';

    try {
      const parsedArray = JSON.parse(rawValue);
      return parsedArray[0] || '';
    } catch (e) {
      console.error('Failed to parse accommodations value:', e);
      return '';
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);

      const productDetails = await fetchProductDetails(packageID);
      setProduct(productDetails.data.product);

      const itinerary_at_glance_with_imagesIDs =
        productDetails.data.product.metafields.edges.find(
          (e: any) => e.node.key === 'itinerary_at_glance_with_images',
        );

      setItineraryImageMetaIds(
        itinerary_at_glance_with_imagesIDs &&
          JSON.parse(itinerary_at_glance_with_imagesIDs.node.value),
      );

      // Set PRoduct Variants
      setProductVariants(productDetails.data.product.variants.edges);
      setSelectedVariant(productDetails.data.product.variants.edges[0].node);

      const images = productDetails.data?.product?.images?.edges.map(
        (n: any) => n.node,
      );

      setCrosolImages(images);

      const itenrayIdsField =
        productDetails?.data?.product?.metafields?.edges.filter(
          (item: any) => item?.node.key === 'itinerary',
        )[0];

      if (itenrayIdsField) {
        const itenaryIDs = JSON.parse(itenrayIdsField?.node?.value);

        setItenaryIds(itenaryIDs);

        setSelectedDay(itenaryIDs[0]);
      }

      const overviewDescription =
        productDetails?.data?.product?.metafields?.edges.filter(
          (item: any) => item?.node.key === 'overview_description',
        );

      if (overviewDescription && overviewDescription.length > 0) {
        const parsedDescriptionData = JSON.parse(
          overviewDescription[0].node.value,
        );

        if (parsedDescriptionData) {
          setOverviewDescription(
            parsedDescriptionData.children[0].children[0].value,
          );
        }
      }
      const productOverview =
        productDetails?.data?.product?.metafields?.edges?.find(
          (edge: any) => edge?.node?.key === 'product_overview',
        )?.node?.value;

      if (productOverview) {
        try {
          let cleanedOverview = productOverview.replace(/[\[\]"]+/g, '');
          const parsedOverview = [];

          // This regex splits the string where there is a label like "DAYS:"
          const parts = cleanedOverview.split(/([A-Z\s]+:)/).filter(Boolean);

          let label = '';
          for (let i = 0; i < parts.length; i++) {
            if (parts[i].match(/^[A-Z\s]+:$/)) {
              label = parts[i].replace(':', '').trim();
            } else if (label) {
              parsedOverview.push({
                label: label,
                value: parts[i].trim(),
              });
              label = '';
            }
          }

          setOverviewlist(parsedOverview);
        } catch (error) {
          console.error('Error parsing product overview:', error);
        }
      }

      // Set Option Tour IDS
      const availableOptionalTours =
        productDetails.data?.product?.metafields.edges.find(
          edge => edge.node.key === 'optional_activities',
        );

      if (availableOptionalTours && availableOptionalTours.node.value) {
        const parsing = JSON.parse(availableOptionalTours.node.value);
        setAllOptionToursAvailableIds(parsing);
      }

      const normalizeText = (text: string) =>
        text
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();

      const hightLightData = images
        .filter((item: any) => item.altText.trim() !== '')
        .filter(
          (item: any, index: number, self: any[]) =>
            index ===
            self.findIndex(
              t => normalizeText(t.altText) === normalizeText(item.altText),
            ),
        );

      setHighlightsData(hightLightData);

      // set duration Of Days for Calendar
      const durationOfDays =
        productDetails.data?.product?.metafields.edges.find(
          edge => edge.node.key === 'duration_of_days',
        );

      if (durationOfDays) {
        const [daysPart, nightsPart] = durationOfDays.node.value.split(',');

        const days = parseInt(daysPart, 10);
        const nights = parseInt(nightsPart, 10);
        setDurationOfDays({
          days: days,
          nights: nights,
        });
      }

      const parsedData = productDetails.data?.product?.metafields?.edges?.find(
        (edge: any) => edge.node.key === 'itinerary_at_glance',
      )?.node.value;

      if (parsedData) {
        const glance = parsedData ? JSON.parse(parsedData) : null;
        const glanceData = glance.children[0].children.map(
          (item: any, index: number) => {
            const value = item.children[0].value;
            const dayMatch = value.match(/\(Day (\d+)\)/);
            const day = dayMatch ? `Day ${dayMatch[1]}` : '';
            const name = value.replace(/\(Day \d+\)/, '').trim();
            const imageUrl = images[index]?.url || null;
            const additionalNotes =
              'Ensure that you check for any travel restrictions and entry requirements.';
            return {
              id: index.toString(),
              day,
              name,
              additionalNotes,
              imageUrl,
            };
          },
        );
        setGlanceData(glanceData);
      }

      // Included items processing
      const parsedData2 = productDetails.data?.product?.metafields?.edges?.find(
        (edge: any) => edge.node.key === 'your_tour_includes',
      )?.node.value;

      if (parsedData2) {
        const includedItems = JSON.parse(parsedData2).children[0].children.map(
          (item: any, index: number) => {
            const value = item.children[0].value;
            const [mainCategory, ...details] = value.split(':');
            return {
              id: index.toString(),
              mainCategory: mainCategory.trim(),
              details: details.join(':').trim(),
            };
          },
        );

        setIncludedTour(includedItems);
      }

      // Parse the travel tips JSON data
      const travelTipsNode =
        productDetails.data?.product?.metafields?.edges?.find(
          edge => edge.node.key === 'travel_tips',
        )?.node.value;

      if (travelTipsNode) {
        const parsedData = JSON.parse(travelTipsNode);

        // Extracting titles dynamically (bolded text)
        const productTitle = parsedData.children.find(
          item =>
            item.type === 'paragraph' &&
            item.children.some(child => child.bold),
        )?.children[0].value;

        // Process sections dynamically
        const tourTrip = parsedData.children
          .map((item, index) => {
            if (item.type === 'paragraph') {
              const title = item.children[0]?.value;
              const nextIndex = parsedData.children.indexOf(item) + 1;
              const detailsItem = parsedData.children[nextIndex];

              if (
                detailsItem?.type === 'list' &&
                detailsItem.listType === 'unordered'
              ) {
                const details = detailsItem.children
                  .map(detail => detail.children[0]?.value)
                  .join(' ');
                return {id: index.toString(), title, details};
              }
            }
            return null;
          })
          .filter(item => item);

        setTourTrip(tourTrip);
        setProductTitle(productTitle);
      }

      // FAQ Data Processing
      const faqDataRaw = JSON.parse(
        productDetails.data?.product?.metafields?.edges?.find(
          edge => edge.node.key === 'faq_s',
        )?.node.value,
      );

      const faqData = faqDataRaw.children.reduce(
        (acc: any, item: any, index: number) => {
          if (
            item.type === 'heading' &&
            faqDataRaw.children[index + 1]?.type === 'paragraph'
          ) {
            const title = item.children[0]?.value;
            const detailsNode = faqDataRaw.children[index + 1];
            const details =
              detailsNode?.children?.map(detail => detail.value).join(' ') ||
              '';

            acc.push({
              id: acc.length.toString(),
              title,
              details,
            });
          }
          return acc;
        },
        [],
      );

      setFaqData(faqData);

      // Processing the variantEdges for occupancy data
      const variantEdges = productDetails?.data?.product?.variants?.edges || [];

      // const occupancyData = {
      //   Single: 'Not Available',
      //   Double: 'Not Available',
      //   Triple: 'Not Available',
      //   Quadruple: 'Not Available',
      // };

      // variantEdges.forEach((edge: any) => {
      //   const title = edge?.node?.title.toLowerCase();
      //   const priceNode = edge?.node?.presentmentPrices?.edges[1]?.node;

      //   const price =
      //     priceNode && priceNode?.price && priceNode?.price.amount
      //       ? `${getCurrencySymbol(priceNode?.price.currencyCode) || 'N/A'} ${
      //           priceNode?.price.amount || 'N/A'
      //         }`
      //       : 'Not Available';

      //   if (
      //     title.includes('single occupancy') ||
      //     title.includes('single') ||
      //     title.includes('one')
      //   ) {
      //     occupancyData.Single = price;
      //   } else if (
      //     title.includes('double occupancy') ||
      //     title.includes('two')
      //   ) {
      //     occupancyData.Double = price;
      //   } else if (
      //     title.includes('triple occupancy') ||
      //     title.includes('three')
      //   ) {
      //     occupancyData.Triple = price;
      //   } else if (
      //     title.includes('quadruple occupancy') ||
      //     title.includes('four')
      //   ) {
      //     occupancyData.Quadruple = price;
      //   }
      // });

      // const RowData = [
      //   'Per Person',
      //   occupancyData.Single,
      //   occupancyData.Double,
      //   occupancyData.Triple,
      //   occupancyData.Quadruple,
      // ];

      // setRowData(RowData);

      const airFare_TransString =
        productDetails.data?.product?.metafields?.edges?.find(
          (edge: any) => edge.node.key === 'airfare_transportation',
        )?.node.value;

      if (
        airFare_TransString &&
        airFare_TransString ===
          '["If you need airfare included for your guided tour please contact us today and we will be able to provide you with airfare accommodations. If you contact us about airfare the price of your guided tour will very so we will get back to you within 24-48 hours."]'
      ) {
        console.log('Airfare data not available');
        setAirFareTrans(
          'If you need airfare included for your guided tour please contact us today and we will be able to provide you with airfare accommodations. If you contact us about airfare the price of your guided tour will very so we will get back to you within 24-48 hours.',
        );
      } else {
        try {
          if (airFare_TransString) {
            const airFare_Trans = JSON.parse(airFare_TransString); // Convert to Array

            if (!Array.isArray(airFare_Trans) || airFare_Trans.length < 2) {
              console.error('Invalid airfare data format', airFare_Trans);
              return;
            }

            const intro = airFare_Trans[0]; // First element is the intro text

            // Ensure all flights are valid strings before processing
            const flightDetails = airFare_Trans
              .slice(1)
              .map((flight, index) => {
                if (typeof flight !== 'string') {
                  console.error(
                    `Error: Flight at index ${index + 1} is not a string:`,
                    flight,
                  );
                  return []; // Return empty array to prevent undefined errors
                }
                if (!flight.includes('|')) {
                  console.error(
                    `Error: Flight at index ${
                      index + 1
                    } is missing '|' separator:`,
                    flight,
                  );
                  return [];
                }
                return flight.split('|').map(item => item.trim());
              });

            // Extract flight numbers safely
            const flightNumber = flightDetails.map(
              details => details[0] || 'Unknown Flight',
            );

            // Extract departing details safely
            const departing = flightDetails.map(
              details => details[1] || 'Unknown Departure',
            );

            // Extract arrival details safely
            const arrival = flightDetails.map(
              details => details[2] || 'Unknown Arrival',
            );

            const flightDay = flightDetails.map(
              details => details[3] || 'Unknown Flight Day',
            );

            const result = {
              intro,
              flightNumber,
              departing,
              arrival,
              flightDay,
            };

            setAirFareTrans(result);
          }
        } catch (error) {
          console.error('Error parsing airfare data:', error);
        }
      }

      const accomdationIdRaw =
        productDetails.data?.product?.metafields?.edges?.find(
          (edge: any) => edge.node.key === 'accommodations',
        )?.node.value;

      if (accomdationIdRaw) {
        const accommodationId = getAccommodationId(accomdationIdRaw);
        const accomodationData = await fetchMultipleMetaData([accommodationId]);
        const fields = accomodationData?.data?.nodes[0]?.fields;

        const getValueByKey = (key: string) =>
          fields.find((item: any) => item.key === key)?.value;

        const descriptionValue = getValueByKey('description');
        const titleValue = getValueByKey('name');
        const hotelType = getValueByKey('hotal_type');
        const accCity = getValueByKey('city');
        const img = getValueByKey('image');

        const image = await getMediaImageById(img);
        const descriptionJson = JSON.parse(descriptionValue);
        const text = descriptionJson.children[0].children[0].value;

        setAccommodationImg(image?.url);
        setAccommodationDes(text);
        setAccommodationTitle(titleValue);
        setAccCity(accCity);
        setHotelType(hotelType);
      }

      // Example Usage
      const youtubeLinks =
        productDetails.data?.product?.metafields?.edges?.find(
          (edge: any) => edge.node.key === 'youtube_videos',
        )?.node.value;

      const parsedYoutubeLinks = youtubeLinks ? JSON.parse(youtubeLinks) : [];
      const extractedYoutubelinks = parsedYoutubeLinks.map((iframe: string) => {
        const match = iframe.match(/src="([^"]+)"/);
        return match ? match[1] : null;
      });

      setYoutubelinks(extractedYoutubelinks);

      const topIconsIDs = productDetails.data?.product?.metafields?.edges?.find(
        (edge: any) => edge.node.key === 'overview_features_icons',
      )?.node.value;

      if (topIconsIDs) {
        setTopSvgIconIds(JSON.parse(topIconsIDs));
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching product:', error);
    }
  };

  const handleLanguageBtn = (id: string) => {
    setVisibleText(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderDaysList = ({item, index}: any) => {
    const viewStyle =
      selectedDay === item ? styles.selectedDayView : styles.unselectedDayView;
    const textStyle =
      selectedDay === item ? styles.selectedText : styles.unselectedText;

    return (
      <TouchableOpacity onPress={() => setSelectedDay(item)} style={viewStyle}>
        <Text style={textStyle}>{`Day ${index + 1}`}</Text>
      </TouchableOpacity>
    );
  };

  const renderButton = ({item, index}: any) => (
    <TouchableOpacity
      style={[
        styles.glancebtn,

        {
          backgroundColor:
            tourHighlights === item.key ? Colors.navyblue : Colors.white,
        },
      ]}
      onPress={() => {
        setTourHighlights(item.key);
      }}
      activeOpacity={0.8}>
      <Text
        style={[
          styles.btntxt,
          {
            color:
              tourHighlights === item.key ? Colors.white : Colors.secondaryfont,
          },
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({item, index}: {item: Root2; index: number}) => {
    const imageUrl = item.fields.find(field => field.key === 'image')?.reference
      ?.image?.url;
    const title = item.fields.find(field => field.key === 'title_id')?.value;
    const day = item.fields.find(field => field.key === 'day_title')?.value;
    const additionalNotes = item.fields.find(
      field => field.key === 'content',
    )?.value;

    return (
      <View style={styles.card}>
        <Image
          source={imageUrl ? {uri: imageUrl} : ImagePath.City}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={commonStyles.font10Regular}>{day}</Text>
          <Text style={{...commonStyles.font12Bold, flexWrap: 'wrap'}}>
            {title}
          </Text>
          <Text style={[commonStyles.font10Bold, styles.description]}>
            {additionalNotes}
          </Text>
        </View>
      </View>
    );
  };

  const renderHighlights = ({item}: any) => {
    return (
      <View style={styles.listview}>
        {item.altText && (
          <Image
            source={item.url ? {uri: item.url} : ImagePath.City}
            style={{
              width: 140,
              height: 140,
              borderRadius: 5,
            }}
          />
        )}
        <SizeBox size={2} />
        {item.altText ? (
          <Text
            style={[
              styles.listtitle,
              {
                textAlign: 'center',
                flexWrap: 'wrap',
              },
            ]}>
            {item.altText}
          </Text>
        ) : null}
      </View>
    );
  };

  const renderTravelTips = ({item}: {item: any}) => {
    const isTextVisible = visibleText[item.id];
    return (
      <View style={styles.tipsview}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.langbtn}
          onPress={() => handleLanguageBtn(item.id)}>
          <Text style={{...commonStyles.font10Regular, color: Colors.white}}>
            {item.title}
          </Text>
          <VectorIcon
            groupName="FontAwesome"
            name={isTextVisible ? 'angle-up' : 'angle-down'}
            size={20}
          />
        </TouchableOpacity>
        {isTextVisible && (
          <Text
            style={{
              ...commonStyles.font10Bold,
              marginHorizontal: 10,
              marginVertical: 10,
            }}>
            {item.details}
          </Text>
        )}
      </View>
    );
  };

  const renderFAQs = ({item}: {item: any}) => {
    const isTextVisible = faqsText[item.id];

    return (
      <View style={styles.tipsview}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.langbtn}
          onPress={() => handleLanguageButtons(item.id)}>
          <Text
            style={{
              ...commonStyles.font10Regular,
              color: Colors.white,
              width: '90%',
            }}>
            {item.title}
          </Text>
          <VectorIcon
            groupName="FontAwesome"
            name={isTextVisible ? 'angle-up' : 'angle-down'}
            size={20}
          />
        </TouchableOpacity>

        {isTextVisible && (
          <Text
            style={{
              ...commonStyles.font10Bold,
              marginHorizontal: 10,
              marginVertical: 10,
            }}>
            {item.details}
          </Text>
        )}
      </View>
    );
  };

  const activityItem = itenaryData?.data?.metaobject?.fields.filter(
    (item: any) => item.key === 'activities',
  );

  const activityData =
    activityItem?.length > 0 && JSON.parse(activityItem[0]?.value)?.children;

  const itenaryMapPins = useMemo(() => {
    if (!activityData?.length) return [];

    return activityData
      .map((item: {children: {value: any}[]}) => {
        const activityValue = item?.children[1]?.value;
        if (activityValue?.includes('||')) {
          const [_, coordsPart] = activityValue.split('||');
          const [latStr, lonStr] = coordsPart.split(',').map(s => s.trim());
          const lat = parseFloat(latStr);
          const lon = parseFloat(lonStr);
          return !isNaN(lat) && !isNaN(lon) ? {lat, lon} : null;
        }
        return null;
      })
      .filter(Boolean);
  }, [activityData]);

  const region = useMemo(
    () =>
      calculateRegion(itenaryMapPins, {
        latitude: locationData.latitude
          ? Number(locationData.latitude)
          : 37.78825,
        longitude: locationData.longitude
          ? Number(locationData.longitude)
          : -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }),
    [itenaryMapPins, locationData],
  );

  const contentItem = itenaryData?.data?.metaobject?.fields.filter(
    (item: any) => item.key === 'content',
  );

  const contentData =
    contentItem?.length > 0 && JSON.parse(contentItem[0]?.value)?.children;

  const locationItem = itenaryData?.data?.metaobject?.fields.filter(
    (item: any) => item.key === 'location_single',
  );

  useEffect(() => {
    if (locationItem?.length > 0) {
      setPin({
        latitude: Number(locationItem[0]?.value?.split(',')[0].trim()),
        longitude: Number(locationItem[0]?.value?.split(',')[1].trim()),
      });
      setLocationData({
        latitude: locationItem[0]?.value?.split(',')[0].trim(),
        longitude: locationItem[0]?.value?.split(',')[1].trim(),
      });
    }
  }, [itenaryData]);

  const shortDescription = product?.metafields?.edges?.find(
    (edge: any) => edge.node.key === 'short_description',
  )?.node.value;

  const addToCartHandler = async () => {
    const userEmail = await getData(STORAGE_KEYS.userEmail);
    const cartList = await getData(STORAGE_KEYS.cartList);
    const merchandiseId = selectedVariant?.id;

    const optionalTourMerchandiseIds = selectedOptionalToursVariants.map(
      item => item.variantId,
    );

    const cart =
      (cartList &&
        cartList.length > 0 &&
        cartList.filter((item: {userEmail: string; cartID: string}) => {
          return item.userEmail.trim() === userEmail?.trim();
        })[0]) ||
      null;

    let quantity: number | undefined;

    if (isCustomDate && selectedOccupancy) {
      if (selectedOccupancy === 'Single Occupancy') {
        quantity = 1;
      } else if (selectedOccupancy === 'Double Occupancy') {
        quantity = 2;
      } else if (selectedOccupancy === 'Triple Occupancy') {
        quantity = 3;
      } else if (selectedOccupancy === 'Quadruple Occupancy') {
        quantity = 4;
      }
    } else {
      if (selectedVariant?.title.split(' / ')[2] === 'Single Occupancy') {
        quantity = 1;
      } else if (
        selectedVariant?.title.split(' / ')[2] === 'Double Occupancy'
      ) {
        quantity = 2;
      } else if (
        selectedVariant?.title.split(' / ')[2] === 'Triple Occupancy'
      ) {
        quantity = 3;
      } else if (
        selectedVariant?.title.split(' / ')[2] === 'Quadruple Occupancy'
      ) {
        quantity = 4;
      }
    }

    if (cart && merchandiseId) {
      addToCart(
        cart.cartID,
        merchandiseId,
        quantity,
        isCustomDate ? selectedCustomDate : null,
        isCustomDate ? selectedOccupancy : null,
        isCustomDate ? selectedRoom : null,
        optionalTourMerchandiseIds,
      )
        .then(res => {
          setModalVisible(false);
          navigation.navigate(NavigationStrings.Cart);
        })
        .catch(err => {
          console.log(JSON.stringify(err), ' err in addToCart');
        });
    } else {
      createCart()
        .then(async res => {
          if (res.data.cartCreate.cart.id) {
            await storeData(
              STORAGE_KEYS.cartList,
              cartList
                ? [
                    ...cartList,
                    {
                      userEmail: userEmail,
                      cartID: res.data.cartCreate.cart.id,
                    },
                  ]
                : [
                    {
                      userEmail: userEmail,
                      cartID: res.data.cartCreate.cart.id,
                    },
                  ],
            );
            if (merchandiseId) {
              addToCart(
                res.data.cartCreate.cart.id,
                merchandiseId,
                quantity,
                isCustomDate ? selectedCustomDate : null,
                isCustomDate ? selectedOccupancy : null,
                isCustomDate ? selectedRoom : null,
                optionalTourMerchandiseIds,
              )
                .then(res => {
                  setModalVisible(false);
                  navigation.navigate(NavigationStrings.Cart);
                })
                .catch(err => {
                  console.log(err, ' err in addToCart');
                });
            }
          }
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
    }
  };

  const getOptionalTourLists = async () => {
    if (allOptionToursAvailableIds && allOptionToursAvailableIds.length > 0) {
      try {
        const optionalTourData = await GetMultipleProductsDetail(
          allOptionToursAvailableIds,
        );
        setAllOptionalToursData(optionalTourData);
      } catch (error) {
        console.error('Error fetching or processing Optional Tours:', error);
      }
    }
  };

  const getSelectedDayMetaData = async () => {
    if (selectedDay) {
      try {
        const itenaryData = await fetchItineraryMetaobject(selectedDay);

        if (itenaryData) {
          setItenaryData(itenaryData);

          const optionalTour = itenaryData?.data?.metaobject?.fields?.find(
            (field: any) => field.key === 'optional_tour',
          )?.value;

          const moreOptionalTours = itenaryData?.data?.metaobject?.fields?.find(
            (field: any) => field.key === 'more_optional_tour',
          )?.value;

          let optionalTourIds = [];

          if (optionalTour) {
            optionalTourIds.push(optionalTour);
          }

          if (moreOptionalTours) {
            const parsedMoreTours = JSON.parse(moreOptionalTours);
            if (Array.isArray(parsedMoreTours)) {
              optionalTourIds = [...optionalTourIds, ...parsedMoreTours];
            }
          }

          setOptionalTourIds(optionalTourIds);

          if (optionalTourIds.length > 0) {
            try {
              const result = await GetMultipleProductsDetail(optionalTourIds);
              setProducts(result);
            } catch (error) {
              console.error('Error fetching products:', error);
            } finally {
            }
          } else {
            setProducts([]);
          }
        }
      } catch (error) {
        console.error('Error fetching or processing itinerary data:', error);
        setOptionalTourIds([]);
        setProducts([]);
        setLoading(false);
      }
    }
  };

  const renderOptionalProducts = ({item}: {item: any}) => (
    <View style={styles.optionalTourCard}>
      {item.featuredImage?.url && (
        <Image
          source={{uri: item.featuredImage.url}}
          style={styles.optionalTourImage}
          resizeMode="cover"
        />
      )}
      <SizeBox size={3} />
      <Text style={styles.optionalTourTitle}>{item.title}</Text>
      <TouchableOpacity
        style={styles.optionalTourButton}
        onPress={() => {
          if (!isAuth) {
            navigation.navigate('RegisterScreen');
          } else {
            navigation.navigate(NavigationStrings.Cart);
          }
        }}
        activeOpacity={0.8}>
        <Text style={styles.optionalTourButtonText}>Add Optional Tour</Text>
      </TouchableOpacity>
    </View>
  );

  const getOptionalTourVariantIds = async () => {
    try {
      const optionalTours = await GetMultipleProductsDetail(
        allOptionToursAvailableIds,
      );

      if (optionalTours) {
        const ids = optionalTours.map(
          (tour: any) => tour.variants.edges[0].node.id,
        );
        setAllOptionTourMerchandiseID(ids);
      }
    } catch (error) {
      console.error('Error fetching Top ICONs Data:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (allOptionToursAvailableIds && allOptionToursAvailableIds.length > 0) {
      getOptionalTourLists();
    }
  }, [allOptionToursAvailableIds]);

  // Auto-select all optional tours by default
  useEffect(() => {
    if (allOptionalToursData && allOptionalToursData.length > 0) {
      const tourIds = allOptionalToursData.map(tour => tour.id);
      const tourVariants = allOptionalToursData
        .filter(tour => tour.variants?.edges?.length > 0)
        .map(tour => ({
          tourId: tour.id,
          variantId: tour.variants.edges[0].node.id,
        }));

      setSelectedOptionalTours(tourIds);
      setSelectedOptionalToursVariants(tourVariants);
    }
  }, [allOptionalToursData]);

  useEffect(() => {
    getSelectedDayMetaData();
  }, [selectedDay]);

  const formatDate = (title: string) => {
    if (!title) return '';

    const splitTitle = title?.split(' / ')[0]; // Extract before "/"
    const start = splitTitle?.split(' - ')[0]?.split(' ');
    const end = splitTitle?.split(' - ')[1]?.split(' ');

    // Check if start[0] is a number (day)
    if (!start || isNaN(Number(start[0]))) {
      return ''; // Not a date range
    }

    return end
      ? `${start[0]} ${start[1].slice(0, 3)} ${start[2]} - ${
          end[0]
        } ${end[1].slice(0, 3)} ${end[2]}`
      : '';
  };

  const getItineraryMetaData = async () => {
    try {
      const itenaryData = await fetchMultipleMetaData(itineraryImageMetaIds);

      if (itenaryData) {
        setItineraryImageData(itenaryData?.data?.nodes);
      }
    } catch (error) {
      console.error('Error fetching itinerary data:', error);
    }
  };

  const getTopIconsData = async () => {
    try {
      const topIconsData = await fetchMultipleMetaData(topSvgIconIds);

      if (topIconsData?.data?.nodes) {
        const mappedData = topIconsData.data.nodes.map((item: any) => {
          const titleField = item.fields.find((f: any) => f.key === 'title');
          const imageField = item.fields.find((f: any) => f.key === 'image');

          return {
            title: titleField?.value || '',
            iconUrl: imageField?.reference?.image?.url || '',
          };
        });

        setTopIconsData(mappedData);
      }
    } catch (error) {
      console.error('Error fetching Top ICONs Data:', error);
    }
  };

  useEffect(() => {
    if (itineraryImageMetaIds && itineraryImageMetaIds.length > 0) {
      getItineraryMetaData();
    }
  }, [itineraryImageMetaIds]);

  useEffect(() => {
    if (topSvgIconIds && topSvgIconIds.length > 0) {
      getTopIconsData();
    }
  }, [topSvgIconIds]);

  useEffect(() => {
    if (productVariants && productVariants.length > 0 && selectedVariant) {
      const occupancyData = {
        Single: 'Not Available',
        Double: 'Not Available',
        Triple: 'Not Available',
        Quadruple: 'Not Available',
      };

      // 👉 Extract date range (before first " / ")
      const getDateRange = title => title.split(' / ')[0];

      // Date range of selected variant
      const selectedDateRange = getDateRange(selectedVariant.title);

      // Filter all variants with same date range
      const matchingVariants = productVariants.filter(variantObj => {
        const variant = variantObj.node; // since you wrapped each in node
        return getDateRange(variant.title) === selectedDateRange;
      });

      matchingVariants.forEach((edge: any) => {
        const title = edge?.node?.title.toLowerCase();
        const priceNode = edge?.node?.presentmentPrices?.edges[1]?.node;

        const price =
          priceNode && priceNode?.price && priceNode?.price.amount
            ? `${getCurrencySymbol(priceNode?.price.currencyCode) || 'N/A'} ${
                priceNode?.price.amount || 'N/A'
              }`
            : 'Not Available';

        if (
          title.includes('single occupancy') ||
          title.includes('single') ||
          title.includes('one')
        ) {
          occupancyData.Single = price;
        } else if (
          title.includes('double occupancy') ||
          title.includes('two')
        ) {
          occupancyData.Double = price;
        } else if (
          title.includes('triple occupancy') ||
          title.includes('three')
        ) {
          occupancyData.Triple = price;
        } else if (
          title.includes('quadruple occupancy') ||
          title.includes('four')
        ) {
          occupancyData.Quadruple = price;
        }
      });

      const RowData = [
        'Per Person',
        occupancyData.Single,
        occupancyData.Double,
        occupancyData.Triple,
        occupancyData.Quadruple,
      ];

      setRowData(RowData);
    }
  }, [productVariants, selectedVariant]);

  useEffect(() => {
    if (allOptionToursAvailableIds && allOptionToursAvailableIds.length > 0) {
      getOptionalTourVariantIds();
    }
  }, [topSvgIconIds]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primaryblue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, backgroundColor: Colors.white}}>
          <ImageBackground
            source={
              product?.images?.edges[0]?.node.url
                ? {uri: product?.images?.edges[0]?.node.url}
                : ImagePath.City
            }
            style={{width: '100%', height: height / 2.9}}>
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
          <View>
            <View style={styles.profilecon}>
              <Text style={{...commonStyles.font20navy}}>{product?.title}</Text>
              <SizeBox size={5} />
              {!isOptionalTour && (
                <View>
                  <Text style={styles.datetxt}>Dates / Quantity</Text>
                  <SizeBox size={3} />
                  <TouchableOpacity
                    style={styles.dateQuentityCon}
                    onPress={() => setIsDateModalVisible(true)}
                    activeOpacity={0.8}>
                    <Text
                      style={[
                        styles.selectedText,
                        {color: Colors.navyblue, width: '90%'},
                      ]}>
                      {isCustomDate
                        ? selectedCustomDate
                        : selectedVariant?.title}
                    </Text>
                    <VectorIcon
                      groupName="AntDesign"
                      name={isDateModalVisible ? 'caretup' : 'caretdown'}
                      size={10}
                      color="navy"
                    />
                  </TouchableOpacity>
                  <SizeBox size={10} />
                  {!isOptionalTour && durationOfDays && (
                    <View style={{alignSelf: 'center'}}>
                      <CustomDateButton
                        onRangeSelect={(start, end) => {
                          setCustomDateRange({start, end});
                          setIsCustomDate(true);
                        }}
                        days={durationOfDays?.days}
                        nights={durationOfDays?.nights}
                        setSelectedCustomDate={setSelectedCustomDate}
                      />
                    </View>
                  )}
                </View>
              )}

              <SizeBox size={10} />
              <Text style={styles.placeserveytxt}>{shortDescription}</Text>
              <>
                <SizeBox size={10} />

                <View>
                  <Text style={styles.overviewtxt}>
                    Overview of{' '}
                    <Text style={{color: Colors.primaryblue}}>
                      {product.title}
                    </Text>
                  </Text>

                  <SizeBox size={5} />
                  {topIconsData && topIconsData.length > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        flexWrap: 'wrap',
                        marginVertical: verticalScale(30),
                      }}>
                      {topIconsData.map(icons => (
                        <View
                          style={{
                            alignItems: 'center',
                            gap: moderateScale(5),
                            minWidth: width * 0.33,
                            marginVertical: verticalScale(10),
                          }}>
                          <SvgUri width={30} height={30} uri={icons.iconUrl} />
                          <Text>{icons.title}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {isOptionalTour && overviewDescription && (
                    <Text style={styles.placeserveytxt}>
                      {overviewDescription}
                    </Text>
                  )}

                  <SizeBox size={5} />

                  <FlatList
                    data={overviewlist}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignSelf: 'center',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={ImagePath.Flight}
                              style={{
                                height: 13,
                                width: 16,
                                resizeMode: 'contain',
                              }}
                            />
                            <Text
                              style={[
                                styles.dates,
                                {fontWeight: '500', marginLeft: 10},
                              ]}>
                              {item?.label}
                            </Text>
                          </View>
                          <Text style={styles.dayphase}>{item?.value}</Text>
                        </View>
                        <SizeBox size={5} />
                      </>
                    )}
                  />
                </View>
              </>
              <>
                <SizeBox size={10} />
                <View style={styles.restrictionview}>
                  <Text style={styles.restrictiontxt}>
                    Ensure that you check for any travel restrictions and entry
                    requirements at your destination. It is your responsibility
                    to be prepared with all necessary travel documents and
                    paperwork. Plan to arrive at the airport at least three
                    hours before your scheduled departure time.
                  </Text>
                </View>
              </>
            </View>
          </View>
        </View>

        <SizeBox size={10} />
        <View style={{paddingHorizontal: 20}}>
          <>
            {/* <Text style={{...commonStyles.font14Bold}}>{product?.title}</Text> */}
            <SizeBox size={5} />
            <View style={{flexDirection: 'row'}}>
              <FlatList
                data={buttons}
                horizontal
                bounces={false}
                keyExtractor={item => item.key}
                renderItem={renderButton}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <SizeBox size={10} />
            {tourHighlights === 'itinerary' ? (
              <>
                {itineraryImageData?.length > 0 ? (
                  <FlatList
                    data={itineraryImageData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                  />
                ) : (
                  <Text
                    style={{
                      ...commonStyles.font14Center,
                      color: Colors.greyTxt,
                    }}>
                    No Data Available
                  </Text>
                )}
              </>
            ) : null}

            {tourHighlights === 'highlights' ? (
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 10,
                  borderRadius: 10,
                }}>
                {highlightsData?.length > 0 ? (
                  <FlatList
                    data={highlightsData}
                    renderItem={renderHighlights}
                    numColumns={2}
                    contentContainerStyle={{}}
                    columnWrapperStyle={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                ) : (
                  <Text
                    style={{
                      ...commonStyles.font14Center,
                      color: Colors.greyTxt,
                    }}>
                    No Data Available
                  </Text>
                )}
              </View>
            ) : null}

            {tourHighlights === 'Your Tour Includes' ? (
              <>
                {includedTour.length > 0 ? (
                  <FlatList
                    data={includedTour}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                          }}>
                          <Text
                            style={{
                              fontSize: 5,
                              color: Colors.grey,
                            }}>
                            {'\u2B24'}
                          </Text>
                          <Text
                            style={[
                              styles.dayphase,
                              {
                                textDecorationStyle: 'dotted',
                                textDecorationColor: 'black',
                              },
                            ]}>
                            {item.mainCategory}
                          </Text>
                        </View>
                        <SizeBox size={5} />
                      </>
                    )}
                    contentContainerStyle={{
                      paddingHorizontal: moderateScale(10),
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      ...commonStyles.font14Center,
                      color: Colors.greyTxt,
                    }}>
                    No Data Available
                  </Text>
                )}
              </>
            ) : null}

            {tourHighlights === 'Travel Tips' ? (
              <View>
                {productTitle ? (
                  <Text
                    style={{
                      ...commonStyles.font14Regular,
                      color: Colors.primaryblue,
                      marginBottom: 10,
                    }}>
                    {productTitle}
                  </Text>
                ) : null}

                {tourTrip.length > 0 ? (
                  <FlatList
                    data={tourTrip}
                    renderItem={renderTravelTips}
                    keyExtractor={item => item.id}
                    style={{
                      backgroundColor: Colors.white,
                      borderRadius: 10,
                      padding: 10,
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      ...commonStyles.font14Center,
                      color: Colors.greyTxt,
                    }}>
                    No Data Available
                  </Text>
                )}
              </View>
            ) : null}

            {tourHighlights === 'FAQs' ? (
              <>
                {productTitle ? (
                  <Text
                    style={{
                      ...commonStyles.font14Regular,
                      color: Colors.primaryblue,
                      marginBottom: 10,
                    }}>
                    {productTitle}
                  </Text>
                ) : null}
                {faqData.length > 0 ? (
                  <FlatList
                    data={faqData}
                    renderItem={renderFAQs}
                    keyExtractor={item => item.id}
                    style={{
                      borderRadius: 10,
                      padding: 10,
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      ...commonStyles.font14Center,
                      color: Colors.greyTxt,
                    }}>
                    No Data Available
                  </Text>
                )}
              </>
            ) : null}
          </>

          {columns && rowdata.length > 0 && (
            <>
              {/* Price & Availability */}
              <SizeBox size={10} />
              <Text style={{...commonStyles.font20navy}}>
                Price & Availability
              </Text>
              <SizeBox size={10} />
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  bounces={false}>
                  <View>
                    <View style={styles.headerRow}>
                      {columns.map((header, index) => (
                        <Text
                          key={index}
                          style={[styles.text, styles.headerText]}>
                          {header}
                        </Text>
                      ))}
                    </View>
                    <View style={styles.dataRow}>
                      {rowdata.map((value: any, index: number) => (
                        <Text
                          key={index}
                          style={[styles.text, styles.dataText]}>
                          {formatPrice(value)}
                        </Text>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              )}
            </>
          )}

          {/* Gallery */}
          <SizeBox size={10} />
          <Text style={{...commonStyles.font20navy}}>Gallery</Text>
          <SizeBox size={10} />
          <Swiper
            style={{height: moderateScale(423), marginHorizontal: 10}}
            showsPagination={false}
            paginationStyle={{
              bottom: 10,
            }}
            dotColor={Colors.grey}
            activeDotColor={Colors.primaryblue}
            loop={true}
            autoplay={true}>
            {crosolImages.map((item, index) => (
              <View
                key={item.id}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: width / 1.2,
                  height: moderateScale(423),
                }}>
                <View style={styles.swiperview}>
                  <Image
                    source={{uri: item?.url}}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 20,
                      resizeMode: 'cover',
                    }}
                  />
                </View>
              </View>
            ))}
          </Swiper>

          {itenaryIds &&
            itenaryMapPins &&
            itenaryData &&
            contentData &&
            activityData && (
              <>
                {/* Itinerary */}
                <SizeBox size={10} />
                <Text style={{...commonStyles.font20navy}}>Itinerary</Text>
                <SizeBox size={5} />
                <FlatList
                  data={itenaryIds}
                  renderItem={renderDaysList}
                  keyExtractor={item => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                />
                <SizeBox size={10} />
                <View style={styles.outercon}>
                  <View style={{height: height / 4}}>
                    <MapView style={styles.map} region={region}>
                      {itenaryMapPins &&
                        itenaryMapPins.length > 0 &&
                        itenaryMapPins.map((pin: any, index: number) => (
                          <Marker
                            key={index}
                            coordinate={{
                              latitude: pin.lat,
                              longitude: pin.lon,
                            }}>
                            <ImageBackground
                              source={ImagePath.pinIcon}
                              style={styles.markerContainer}
                              imageStyle={styles.markerImage}>
                              <Text style={styles.markerText}>{index + 1}</Text>
                            </ImageBackground>
                          </Marker>
                        ))}
                      {itenaryMapPins.length > 1 && (
                        <MapViewDirections
                          origin={{
                            latitude: itenaryMapPins[0].lat,
                            longitude: itenaryMapPins[0].lon,
                          }}
                          destination={{
                            latitude:
                              itenaryMapPins[itenaryMapPins.length - 1].lat,
                            longitude:
                              itenaryMapPins[itenaryMapPins.length - 1].lon,
                          }}
                          waypoints={
                            itenaryMapPins.length > 2
                              ? itenaryMapPins.slice(1, -1).map((pin: any) => ({
                                  latitude: pin.lat,
                                  longitude: pin.lon,
                                }))
                              : []
                          }
                          apikey={GOOGLE_MAPS_APIKEY}
                          strokeWidth={5}
                          strokeColor={Colors.primaryblue}
                          mode="DRIVING"
                          onError={errorMessage => {
                            console.log(
                              'MapViewDirections Error:',
                              errorMessage,
                            );
                          }}
                        />
                      )}
                    </MapView>
                  </View>
                  <SizeBox size={5} />
                  <Text style={{...commonStyles.font14Bold}}>
                    {itenaryData?.data?.metaobject?.fields[0]?.value}
                  </Text>
                  <SizeBox size={2} />
                  <Text style={{...commonStyles.font12Regualar2}}>
                    {contentData && contentData[0]?.children[0]?.value}
                  </Text>
                  <SizeBox size={5} />
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingRight: 5,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          ...commonStyles.font12Regular,
                          fontWeight: 'bold',
                          color: Colors.primaryblue,
                        }}>
                        Meals Provided:{' '}
                      </Text>
                      <Text style={{...commonStyles.font12Regualar2}}>
                        {contentData && contentData[1]?.children[1].value}
                      </Text>
                    </View>
                    <SizeBox size={2} />
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingRight: 5,
                      }}>
                      <Text
                        style={{
                          ...commonStyles.font12Regular,
                          fontWeight: 'bold',
                          color: Colors.primaryblue,
                        }}>
                        Hotel:{' '}
                      </Text>
                      <Text
                        style={{
                          ...commonStyles.font12Regualar2,
                          width: '90%',
                        }}>
                        {contentData && contentData[2]?.children[1].value}
                      </Text>
                    </View>
                    <SizeBox size={2} />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          ...commonStyles.font12Regular,
                          fontWeight: 'bold',
                          color: Colors.primaryblue,
                        }}>
                        Activities:{' '}
                      </Text>
                      <Text
                        style={{
                          ...commonStyles.font12Regualar2,
                          width: '80%',
                        }}>
                        {contentData && contentData[3]?.children[1].value}
                      </Text>
                    </View>
                    <SizeBox size={2} />

                    <View>
                      <Text
                        style={{
                          ...commonStyles.font12Regular,
                          fontWeight: 'bold',
                          color: Colors.primaryblue,
                        }}>
                        Timeline:{' '}
                      </Text>
                      <SizeBox size={5} />

                      <View style={styles.timelinesContainer}>
                        {activityData &&
                          (() => {
                            let displayIndex = 1;

                            return activityData.map(
                              (activity: any, index: number) => {
                                const activityValue =
                                  activity?.children[1]?.value;
                                const isNumberedItem = (value: string) =>
                                  /^\d+\.$/.test(value?.trim());
                                const hasLats =
                                  activityValue?.includes('||') &&
                                  activityValue?.split('||')[1];
                                const hasDetails =
                                  isNumberedItem(
                                    activity?.children[0]?.value,
                                  ) &&
                                  activityData[index + 1]?.children[0]?.bold ===
                                    undefined &&
                                  activityData[index + 1]?.children[0]?.value;

                                const mainText = activityValue
                                  ?.split(' || ')[0]
                                  ?.trim();

                                const isExpanded =
                                  expandedItems[index] || false;
                                const isnextDEscription =
                                  hasDetails &&
                                  activityData[index + 1]?.children[0].value;

                                const isMainItem =
                                  activityValue &&
                                  isNumberedItem(activity?.children[0]?.value);

                                if (!isMainItem) return null;

                                const itemNumber = displayIndex++;

                                return (
                                  <View key={index}>
                                    <TouchableOpacity
                                      style={styles.timelineBox}
                                      onPress={() =>
                                        hasDetails && toggleExpand(index)
                                      }
                                      activeOpacity={0.8}>
                                      <View style={styles.timelineTextWrapper}>
                                        <Text style={styles.timelineText}>
                                          <Text
                                            style={[
                                              styles.timelineNumber,
                                              {color: Colors.lightGrey},
                                            ]}>
                                            {`${itemNumber}. `}
                                          </Text>
                                          {mainText}
                                        </Text>
                                      </View>

                                      <View style={styles.iconGroup}>
                                        {hasLats && (
                                          <TouchableOpacity
                                            onPress={() => {
                                              const [lat, lon] =
                                                hasLats.split(',');
                                              setLocationData({
                                                latitude: lat,
                                                longitude: lon,
                                              });
                                              setPin({
                                                latitude: Number(lat.trim()),
                                                longitude: Number(lon.trim()),
                                              });
                                            }}>
                                            <VectorIcon
                                              name={'map-pin'}
                                              groupName="Feather"
                                              size={16}
                                              color={Colors.primaryblue}
                                            />
                                          </TouchableOpacity>
                                        )}

                                        {hasDetails && (
                                          <TouchableOpacity
                                            onPress={() => toggleExpand(index)}>
                                            <VectorIcon
                                              name={isExpanded ? 'up' : 'down'}
                                              groupName="AntDesign"
                                              size={16}
                                              color={Colors.primaryblue}
                                            />
                                          </TouchableOpacity>
                                        )}
                                      </View>
                                    </TouchableOpacity>

                                    {isExpanded && isnextDEscription && (
                                      <Text style={styles.timelineDescription}>
                                        {isnextDEscription}
                                      </Text>
                                    )}
                                  </View>
                                );
                              },
                            );
                          })()}
                        <FlatList
                          data={products}
                          keyExtractor={item => item.id}
                          numColumns={2}
                          renderItem={renderOptionalProducts}
                          contentContainerStyle={styles.listContainer}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}

          {accommodationTitle && accommodationImg && accommodationDes && (
            <>
              {/* Accommodation */}
              <SizeBox size={10} />
              <Text style={{...commonStyles.font20navy}}>Accommodation</Text>
              <SizeBox size={5} />
              <View style={styles.outercon}>
                <Image
                  source={
                    accommodationImg
                      ? {uri: accommodationImg}
                      : ImagePath.Cartoon
                  }
                  style={{
                    width: '100%',
                    height: moderateScaleVertical(214),
                    borderRadius: 10,
                  }}
                />
                <SizeBox size={5} />
                <Text style={{...commonStyles.font13, textAlign: 'justify'}}>
                  {accommodationTitle}
                </Text>
                <SizeBox size={2} />
                <Text
                  style={{
                    ...commonStyles.font12Regualar2,
                    // textAlign: Platform.OS === 'ios' ? 'left' : 'justify',
                  }}>
                  {accommodationDes}
                </Text>
                <SizeBox size={5} />
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.standardbtn}>
                    <Text
                      style={{
                        ...commonStyles.font12Regualar2,
                        color: Colors.white,
                      }}>
                      {accCity}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.standardbtn}>
                    <Text
                      style={{
                        ...commonStyles.font12Regualar2,
                        color: Colors.white,
                      }}>
                      {hotelType}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* Airfare and Transportation section */}
          {!isOptionalTour &&
            (airFareTrans ===
            'If you need airfare included for your guided tour please contact us today and we will be able to provide you with airfare accommodations. If you contact us about airfare the price of your guided tour will very so we will get back to you within 24-48 hours.' ? (
              <>
                <SizeBox size={10} />
                <Text style={{...commonStyles.font20navy}}>
                  Airfare & Transportation
                </Text>
                <SizeBox size={5} />
                <View style={styles.airfareContainer}>
                  <View style={styles.airfareNoDataCard}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}>
                      <VectorIcon
                        groupName="MaterialCommunityIcons"
                        name="airplane"
                        size={24}
                        color={Colors.primaryblue}
                      />
                      <Text style={[styles.airfareNoDataText, {flex: 1}]}>
                        If you need airfare included for your guided tour please
                        contact us today and we will be able to provide you with
                        airfare accommodations. If you contact us about airfare
                        the price of your guided tour will vary so we will get
                        back to you within 24-48 hours.
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Airfare & Transportation */}
                <SizeBox size={10} />
                <Text style={{...commonStyles.font20navy}}>
                  Airfare & Transportation
                </Text>
                <SizeBox size={5} />
                <View style={styles.airfareContainer}>
                  {airFareTrans?.intro && (
                    <Text style={styles.airfareIntroText}>
                      {airFareTrans.intro}
                    </Text>
                  )}

                  <View style={styles.airfareCarouselContainer}>
                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      bounces={false}
                      snapToInterval={width}
                      decelerationRate="fast"
                      onScroll={event => {
                        const contentOffsetX =
                          event.nativeEvent.contentOffset.x;
                        const currentIndex = Math.round(contentOffsetX / width);
                        setAirfareCarouselIndex(currentIndex);
                      }}
                      scrollEventThrottle={16}>
                      {airFareTrans?.flightNumber?.map(
                        (item: any, index: number) => {
                          // Get the day number from itinerary if available
                          const dayNumber = index + 1;
                          const dayLabel =
                            itenaryIds && itenaryIds.length > index
                              ? `Day ${dayNumber}`
                              : `Flight ${dayNumber}`;

                          return (
                            <View
                              key={index}
                              style={styles.airfareCarouselItemContainer}>
                              <View style={styles.airfareCarouselItem}>
                                {/* <Text style={styles.airfareFlightNumber}></Text> */}
                                {airFareTrans?.flightDay?.[index] !==
                                'Unknown Flight Day' ? (
                                  <>
                                    <Text
                                      style={styles.airfareFlightNumber}
                                      numberOfLines={1}
                                      ellipsizeMode="tail">
                                      ✈{' '}
                                      {airFareTrans?.flightDay?.[index] ||
                                        'Not Available'}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        fontWeight: '600',
                                        color: Colors.primaryblue,
                                        marginBottom: 12,
                                      }}
                                      numberOfLines={1}
                                      ellipsizeMode="tail">
                                      {item || 'Not Available'}
                                    </Text>
                                  </>
                                ) : (
                                  <Text
                                    style={styles.airfareFlightNumber}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    ✈ {item || 'Not Available'}
                                  </Text>
                                )}

                                <View style={styles.airfareDetailRow}>
                                  <Text style={styles.airfareDetailLabel}>
                                    From:
                                  </Text>
                                  <Text
                                    style={styles.airfareDetailValue}
                                    numberOfLines={2}
                                    ellipsizeMode="tail">
                                    {airFareTrans?.departing?.[index] ||
                                      'Not Available'}
                                  </Text>
                                </View>

                                <View style={styles.airfareDetailRow}>
                                  <Text style={styles.airfareDetailLabel}>
                                    To:
                                  </Text>
                                  <Text
                                    style={styles.airfareDetailValue}
                                    numberOfLines={2}
                                    ellipsizeMode="tail">
                                    {airFareTrans?.arrival?.[index] ||
                                      'Not Available'}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          );
                        },
                      )}
                    </ScrollView>

                    {airFareTrans?.flightNumber &&
                      airFareTrans.flightNumber.length > 0 && (
                        <View style={styles.airfareCarouselIndicatorContainer}>
                          {airFareTrans.flightNumber.map(
                            (_: any, index: number) => (
                              <View
                                key={index}
                                style={
                                  airfareCarouselIndex === index
                                    ? styles.airfareCarouselIndicatorActive
                                    : styles.airfareCarouselIndicator
                                }
                              />
                            ),
                          )}
                        </View>
                      )}
                  </View>
                </View>
              </>
            ))}

          {youtubelinks && youtubelinks.length > 0 && (
            <>
              <SizeBox size={10} />
              <Text style={{...commonStyles.font20navy}}>Tour Activities</Text>
              <SizeBox size={5} />
              <View style={styles.outercon}>
                <FlatList
                  data={youtubelinks}
                  renderItem={({item}) => {
                    const videoId = extractYouTubeVideoID(item);
                    return (
                      <View
                        style={{
                          marginRight: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => handleThumbnailPress(videoId!)}
                          style={{position: 'relative'}}>
                          <Image
                            source={{
                              uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                            }}
                            style={{
                              width: width / 2,
                              height: moderateScaleVertical(200),
                              resizeMode: 'contain',
                            }}
                          />
                          <Image
                            source={ImagePath.youtubeIcon}
                            style={{
                              height: 40,
                              width: 40,
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: [{translateX: -20}, {translateY: -20}], // Center the icon
                              resizeMode: 'contain',
                              zIndex: 100,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              {/* Modal for playing YouTube video */}
              {youtubeModalVisible && (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={youtubeModalVisible}
                  onRequestClose={closeModal}>
                  <TouchableOpacity
                    onPress={closeModal}
                    activeOpacity={1}
                    style={styles.YoutbemodalContainer}>
                    <View
                      onStartShouldSetResponder={() => true} // Capture touch events
                      onResponderRelease={e => e.stopPropagation()} // Prevent propagation
                      style={styles.modalContent}>
                      {selectedVideoId && (
                        <YoutubePlayer
                          height={moderateScaleVertical(200)}
                          width={width - 40} // Adjust to fit modal
                          play={true}
                          videoId={selectedVideoId}
                          onChangeState={state => {
                            if (state === 'ended') {
                              closeModal(); // Close modal when video ends
                            }
                          }}
                        />
                      )}
                      <TouchableOpacity
                        activeOpacity={1}
                        style={styles.closeButton}
                        onPress={closeModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              )}
            </>
          )}
        </View>
        <SizeBox size={10} />
      </KeyboardAwareScrollView>

      <View style={styles.button}>
        <View
          style={{
            alignItems: isOptionalTour ? 'center' : 'flex-start',
            flex: 1,
          }}>
          {!isOptionalTour &&
            formatDate(selectedVariant?.title!).length > 0 && (
              <Text style={[styles.dates, {color: Colors.skyblue}]}>
                {isCustomDate
                  ? selectedCustomDate
                  : formatDate(selectedVariant?.title!)}
              </Text>
            )}

          {product?.title && (
            <Text style={commonStyles.font16White}>
              {product.title.length > 30 &&
              formatDate(selectedVariant?.title!).length > 0
                ? `${product.title.slice(0, 16)}...`
                : product.title}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.booknowbtn}
          onPress={() => {
            if (!isAuth) {
              navigation.navigate('RegisterScreen');
            } else {
              setModalVisible(true);
            }
          }}
          activeOpacity={0.8}>
          <Text style={{...commonStyles.font14Center}}>Book now</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
          }}
          activeOpacity={1}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            onStartShouldSetResponder={() => true} // Capture touch events
            onResponderRelease={e => e.stopPropagation()} // Prevent propagation
            style={{
              padding: 15,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              backgroundColor: 'white',
            }}>
            <View style={styles.profilecon1}>
              <VectorIcon
                groupName="Entypo"
                name="cross"
                size={20}
                color={Colors.black}
                onPress={() => setModalVisible(false)}
                style={{alignSelf: 'flex-end'}}
              />
              <Text style={{...commonStyles.font20navy}}>{product?.title}</Text>
              <SizeBox size={5} />
              <View style={styles.countryimgcon}>
                <Image
                  source={
                    product?.images?.edges[0]?.node.url
                      ? {uri: product?.images?.edges[0]?.node.url}
                      : ImagePath.City
                  }
                  style={{width: 17, height: 17, borderRadius: 20}}
                />
                <Text style={styles.countrytxt}>
                  {product?.tags
                    ?.map(
                      (tag: any) => tag.charAt(0).toUpperCase() + tag.slice(1),
                    )
                    .join(', ')}
                </Text>
              </View>
              <SizeBox size={8} />
              <Text style={styles.placeserveytxt}>
                {shortDescription || 'short description...'}
              </Text>

              {!isOptionalTour && (
                <>
                  <SizeBox size={5} />
                  <Text style={styles.placeserveytxt}>
                    Select Group tour date
                  </Text>
                  <SizeBox size={5} />
                  <TouchableOpacity
                    style={styles.dateQuentityCon}
                    onPress={() => setIsDateModalVisible(true)}
                    activeOpacity={0.8}>
                    <Text
                      style={[
                        styles.selectedText,
                        {color: Colors.navyblue, width: '90%'},
                      ]}>
                      {isCustomDate
                        ? selectedCustomDate
                        : selectedVariant?.title}
                    </Text>
                    <VectorIcon
                      groupName="AntDesign"
                      name={isDateModalVisible ? 'caretup' : 'caretdown'}
                      size={12}
                      color="navy"
                    />
                  </TouchableOpacity>
                  <SizeBox size={5} />

                  {isCustomDate && (
                    <View style={{gap: verticalScale(10)}}>
                      <View
                        style={{
                          gap: moderateScale(10),
                        }}>
                        <>
                          <Text style={styles.placeserveytxt}>
                            Choose Room Occuopancy
                          </Text>
                          <TouchableOpacity
                            style={styles.dateQuentityCon}
                            onPress={() => setShowSelectOccupancyModal(true)}
                            activeOpacity={0.8}>
                            <Text
                              style={[
                                styles.selectedText,
                                {color: Colors.navyblue},
                              ]}>
                              {selectedOccupancy
                                ? selectedOccupancy
                                : 'Select room occupancy'}
                            </Text>
                            <VectorIcon
                              groupName="AntDesign"
                              name={
                                showSelectOccupancyModal
                                  ? 'caretup'
                                  : 'caretdown'
                              }
                              size={12}
                              color="navy"
                            />
                          </TouchableOpacity>
                        </>
                      </View>
                      <View
                        style={{
                          gap: moderateScale(10),
                        }}>
                        <>
                          <Text style={styles.placeserveytxt}>Choose Room</Text>
                          <TouchableOpacity
                            style={styles.dateQuentityCon}
                            onPress={() => setShowSelectRoomModal(true)}
                            activeOpacity={0.8}>
                            <Text
                              style={[
                                styles.selectedText,
                                {color: Colors.navyblue},
                              ]}>
                              {selectedRoom ? selectedRoom : 'Select Room'}
                            </Text>
                            <VectorIcon
                              groupName="AntDesign"
                              name={
                                showSelectRoomModal ? 'caretup' : 'caretdown'
                              }
                              size={12}
                              color="navy"
                            />
                          </TouchableOpacity>
                        </>
                      </View>
                    </View>
                  )}
                </>
              )}

              {allOptionalToursData && allOptionalToursData.length > 0 && (
                <>
                  <Text style={styles.placeserveytxt}>Optional Tours</Text>
                  <SizeBox size={8} />
                  <FlatList
                    data={allOptionalToursData}
                    scrollEnabled={false}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{gap: verticalScale(10)}}
                    renderItem={({item}) => {
                      const variantsList = item.variants?.edges || [];
                      const isChecked = selectedOptionalTours.includes(item.id);
                      const selectedVariant =
                        selectedOptionalToursVariants.find(
                          v => v.tourId === item.id,
                        );

                      // Auto-select first variant when tour is checked
                      const handleTourToggle = () => {
                        if (isChecked) {
                          // Unchecking
                          setSelectedOptionalTours(prev =>
                            prev.filter(id => id !== item.id),
                          );
                          setSelectedOptionalToursVariants(prev =>
                            prev.filter(v => v.tourId !== item.id),
                          );
                        } else {
                          // Checking
                          setSelectedOptionalTours(prev => [...prev, item.id]);
                          // Auto-select first variant by default
                          if (variantsList.length > 0) {
                            setSelectedOptionalToursVariants(prev => [
                              ...prev,
                              {
                                tourId: item.id,
                                variantId: variantsList[0].node.id,
                              },
                            ]);
                          }
                        }
                      };

                      return (
                        <CheckboxItem
                          tourId={item.id}
                          checked={isChecked}
                          onPress={handleTourToggle}
                          label={item.title}
                          variants={item.variants}
                          selectedVariantId={selectedVariant?.variantId || null}
                          onVariantSelect={(variantId: string) => {
                            setSelectedOptionalToursVariants(prev => {
                              const existing = prev.find(
                                v => v.tourId === item.id,
                              );
                              if (existing) {
                                return prev.map(v =>
                                  v.tourId === item.id ? {...v, variantId} : v,
                                );
                              }
                              return [...prev, {tourId: item.id, variantId}];
                            });
                          }}
                        />
                      );
                    }}
                  />
                </>
              )}
              <SizeBox size={10} />
              <SizeBox size={5} />
              <TouchableOpacity
                style={styles.bookingbtn}
                activeOpacity={0.8}
                onPress={addToCartHandler}>
                <Text style={{...commonStyles.font14Center}}>Book Now</Text>
              </TouchableOpacity>
              <SizeBox size={5} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Modal for Pre variant from inside  */}
        <Modal
          visible={isDateModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDateModalVisible(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsDateModalVisible(false)}>
            <View style={styles.modalContainer}>
              <FlatList
                data={productVariants}
                showsVerticalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <>
                    {index === 0 && (
                      <View
                        style={[
                          styles.modalItem,
                          index === productVariants.length - 1
                            ? {borderBottomWidth: 0}
                            : {},
                        ]}>
                        {durationOfDays && (
                          <CustomDateButton
                            onRangeSelect={(start, end) => {
                              setCustomDateRange({start, end});
                              setIsCustomDate(true);
                            }}
                            setSelectedCustomDate={setSelectedCustomDate}
                            days={durationOfDays?.days}
                            nights={durationOfDays?.nights}
                            bgColor="transparent"
                            textColor="white"
                            padding={4}
                          />
                        )}
                      </View>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.modalItem,
                        index === productVariants.length - 1
                          ? {borderBottomWidth: 0}
                          : {},
                      ]}
                      onPress={() => {
                        setSelectedVariant(item.node);
                        setIsDateModalVisible(false);
                        setIsCustomDate(false);
                        setSelectedCustomDate(null);
                      }}>
                      <Text style={styles.modalText}>{item.node.title}</Text>
                    </TouchableOpacity>
                  </>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal for Select Room Occupance */}
        <Modal
          visible={showSelectOccupancyModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSelectOccupancyModal(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowSelectOccupancyModal(false)}>
            <View style={styles.modalContainer}>
              <FlatList
                data={occupancies}
                showsVerticalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      index === occupancies.length - 1
                        ? {borderBottomWidth: 0}
                        : {},
                    ]}
                    onPress={() => {
                      setSelectedOccupancy(item as string);
                      setShowSelectOccupancyModal(false);
                    }}>
                    <Text style={styles.modalText}>{item as string}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal for Select Room */}
        {rooms && (
          <Modal
            visible={showSelectRoomModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowSelectRoomModal(false)}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowSelectRoomModal(false)}>
              <View style={styles.modalContainer}>
                <FlatList
                  data={rooms}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      style={[
                        styles.modalItem,
                        index === rooms.length - 1
                          ? {borderBottomWidth: 0}
                          : {},
                      ]}
                      onPress={() => {
                        setSelectedRoom(item as string);
                        setShowSelectRoomModal(false);
                      }}>
                      <Text style={styles.modalText}>{item as string}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </Modal>

      {/* Modal for Pre variant from outside  */}
      <Modal
        visible={isDateModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDateModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDateModalVisible(false)}>
          <View style={styles.modalContainer}>
            <FlatList
              data={productVariants}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <>
                  {index === 0 && (
                    <View
                      style={[
                        styles.modalItem,
                        index === productVariants.length - 1
                          ? {borderBottomWidth: 0}
                          : {},
                      ]}>
                      {durationOfDays && (
                        <CustomDateButton
                          onRangeSelect={(start, end) => {
                            setCustomDateRange({start, end});
                            setIsCustomDate(true);
                          }}
                          setSelectedCustomDate={setSelectedCustomDate}
                          days={durationOfDays?.days}
                          nights={durationOfDays?.nights}
                          bgColor="transparent"
                          textColor="white"
                          padding={0}
                        />
                      )}
                    </View>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      index === productVariants.length - 1
                        ? {borderBottomWidth: 0}
                        : {},
                    ]}
                    onPress={() => {
                      setSelectedVariant(item.node);
                      setIsDateModalVisible(false);
                      setIsCustomDate(false);
                      setSelectedCustomDate(null);
                    }}>
                    <Text style={styles.modalText}>{item.node.title}</Text>
                  </TouchableOpacity>
                </>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default PackageDetail;
