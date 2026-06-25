import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgUri} from 'react-native-svg';
import BedIcon from '../../Assets/Icons/bedIcon.svg';
import {Product} from '../../Redux/Slices/HomeScreen/type';
import VectorIcon from '../../Utilities/Component/vectorIcons';
import {fetchProducts} from '../../Utilities/Constants/requestHandler';
import {metaToArray, normalizeDuration} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  verticalScale,
} from '../../Utilities/Styles/responsiveSize';

interface CollectionScreenProps {
  route: {
    params: {
      handle: string;
      title?: string;
    };
  };
  navigation: any;
}

const CollectionScreen: React.FC<CollectionScreenProps> = ({
  route,
  navigation,
}) => {
  const {handle, title} = route.params;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch products for the collection
  const fetchCollectionProducts = async (cursor: string | null = null) => {
    try {
      const isLoadingMore = cursor !== null && cursor !== undefined;
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Call API to fetch products for this collection handle using fetchProducts
      const data = await fetchProducts(
        50, // first: number of products to fetch
        cursor, // after: pagination cursor
        handle, // handle: collection handle
      );

      const edges = data?.data?.collectionByHandle?.products?.edges || [];
      const pageInfo = data?.data?.collectionByHandle?.products?.pageInfo || {};

      // Parse products from edges, filtering only ACTIVE products and excluding GIFT CARD
      const newProducts =
        edges
          ?.filter(
            (edge: any) =>
              edge.node.title !== 'GIFT CARD' && edge.node.status === 'ACTIVE',
          )
          ?.map((edge: any) => {
            const node = edge.node;

            console.log(JSON.stringify(node));

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
              ...yearTags,
              ...eventTags,
              ...(selfDriveTag ? [selfDriveTag] : []),
            ];

            const price =
              node?.variants?.edges?.[0]?.node?.presentmentPrices?.edges?.[0]
                ?.node?.price?.amount || '0';

            return {
              id: node.id,
              title: node.title,
              imageUrl: node.images?.edges[0]?.node?.url || null,
              tags,
              country: countryTags[0] || '',
              duration: durationTag || '',
              years: yearTags,
              events: eventTags,
              selfDrive: selfDriveTag || null,
              price: price,
              tourFeatures: node?.tourFeatureMetafield?.value
                ? JSON.parse(node.tourFeatureMetafield.value)
                : [],
              bestSellerBadges: node?.multiplebestSellerMetafield?.value
                ? JSON.parse(node.multiplebestSellerMetafield.value)
                : [],
            };
          }) ?? [];

      // Append or set products
      if (isLoadingMore) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      // Update pagination state
      setHasMore(pageInfo.hasNextPage || false);
      setEndCursor(pageInfo.endCursor || null);

      setLoading(false);
      setLoadingMore(false);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load collection products';
      setError(errorMessage);
      console.error('Error fetching collection products:', err);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCollectionProducts();
  }, [handle]);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && endCursor) {
      fetchCollectionProducts(endCursor);
    }
  };

  const renderProductCard = ({item}: {item: any}) => {
    if (
      item.title === 'N/A' ||
      item.duration === 'N/A' ||
      !item.imageUrl ||
      item.imageUrl === 'N/A'
    ) {
      return null;
    }

    const bestSellerBadges = item.bestSellerBadges || [];

    return (
      <TouchableOpacity
        style={styles.outerview}
        onPress={() => {
          navigation.navigate('PackageDetail', {id: item.id});
        }}
        activeOpacity={0.8}>
        <ImageBackground
          source={
            item.imageUrl
              ? {uri: item.imageUrl}
              : {uri: 'https://via.placeholder.com/400'}
          }
          style={{
            height: Platform.OS === 'ios' ? height / 4.5 : height / 4,
            width: '100%',
            borderRadius: 5,
            justifyContent: 'space-between',
          }}>
          <View>
            {/* Top Left: Best Seller and Other Badges */}
            <View
              style={{
                gap: moderateScale(4),
                top: verticalScale(4),
                left: 4,
                alignItems: 'flex-start',
              }}>
              {bestSellerBadges &&
                bestSellerBadges.length > 0 &&
                bestSellerBadges.map((badge: string, index: number) => (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: moderateScale(10),
                      paddingVertical: verticalScale(4),
                      backgroundColor:
                        badge === 'Select Your Own Dates'
                          ? '#f4ce14'
                          : Colors.primaryblue,
                      borderRadius: 30,
                    }}>
                    <Text
                      style={{
                        color:
                          badge === 'Select Your Own Dates'
                            ? Colors.black
                            : Colors.white,
                        fontSize: 10,
                      }}>
                      {badge}
                    </Text>
                  </View>
                ))}
            </View>

            {/* Top Right: Icons */}
            <View
              style={{
                gap: moderateScale(4),
                position: 'absolute',
                top: verticalScale(4),
                right: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <BedIcon width={20} height={20} />
              <SvgUri
                uri="https://evolution35.com/cdn/shop/files/activities_11d225fe-5346-4fad-8713-b436e4b01db4.svg?v=1745699894"
                width={20}
                height={20}
              />
            </View>
          </View>

          {/* Tour Features Tags */}
          <View style={styles.maintagscontainer}>
            {item?.tourFeatures
              // ?.filter((tag: string) => !/(days|nights)/i.test(tag))
              // .slice(0, 3)
              .map((tag: string, index: number) => (
                <View key={`feature-${index}`} style={styles.tagouterview}>
                  <Text style={{color: 'black', fontSize: 10}}>{tag}</Text>
                </View>
              ))}
          </View>
        </ImageBackground>

        {/* Bottom: Title, Duration and Arrow */}
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
              size={16}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <VectorIcon
            groupName="AntDesign"
            name="arrowleft"
            size={24}
            color={Colors.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'Collection'}</Text>
        <View style={styles.backButton} />
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primaryblue} />
      </View>
    );
  };

  const renderLoadMoreButton = () => {
    if (!hasMore || loadingMore) return null;
    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        activeOpacity={0.7}>
        <Text style={styles.loadMoreText}>Load More Products</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={Colors.primaryblue} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchCollectionProducts()}
            activeOpacity={0.7}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.flatListContent}
        ListFooterComponent={
          <View>
            {renderLoadMoreButton()}
            {renderFooter()}
          </View>
        }
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(12),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: fontFamily.medium,
    color: Colors.black,
    textAlign: 'center',
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
  },
  flatListContent: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(16),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: moderateScaleVertical(16),
  },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: moderateScaleVertical(160),
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tags: {
    position: 'absolute',
    bottom: moderateScaleVertical(8),
    left: moderateScale(8),
    backgroundColor: 'rgba(18, 118, 209, 0.9)',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScaleVertical(4),
    borderRadius: moderateScale(6),
  },
  priceTag: {
    position: 'absolute',
    bottom: moderateScaleVertical(8),
    right: moderateScale(8),
    backgroundColor: 'rgba(18, 118, 209, 0.9)',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScaleVertical(4),
    borderRadius: moderateScale(6),
  },
  priceText: {
    fontSize: moderateScale(14),
    fontFamily: fontFamily.medium,
    color: Colors.white,
  },
  contentContainer: {
    padding: moderateScale(12),
  },
  productTitle: {
    fontSize: moderateScale(14),
    fontFamily: fontFamily.medium,
    color: Colors.black,
    marginBottom: moderateScaleVertical(8),
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(6),
  },
  badge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScaleVertical(4),
    borderRadius: moderateScale(4),
  },
  badgeText: {
    fontSize: moderateScale(11),
    fontFamily: fontFamily.regular,
    color: '#666',
  },
  loadMoreButton: {
    marginHorizontal: moderateScale(16),
    marginVertical: moderateScaleVertical(20),
    paddingVertical: moderateScaleVertical(12),
    backgroundColor: Colors.primaryblue,
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: moderateScale(16),
    fontFamily: fontFamily.medium,
    color: Colors.white,
  },
  footerLoader: {
    paddingVertical: moderateScaleVertical(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: moderateScale(16),
    fontFamily: fontFamily.regular,
    color: Colors.red || '#d32f2f',
    marginBottom: moderateScaleVertical(16),
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScaleVertical(10),
    backgroundColor: Colors.darkPink,
    borderRadius: moderateScale(6),
  },
  retryText: {
    fontSize: moderateScale(14),
    fontFamily: fontFamily.medium,
    color: Colors.white,
  },
  emptyText: {
    fontSize: moderateScale(16),
    fontFamily: fontFamily.regular,
    color: '#999999',
  },
  outerview: {
    marginBottom: verticalScale(12),
    borderRadius: 12,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  maintagscontainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: moderateScale(8),
    marginBottom: verticalScale(8),
    flexWrap: 'wrap',
  },
  tagouterview: {
    borderWidth: 0.5,
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: 10,
    borderColor: Colors.gentlegrey,
    backgroundColor: Colors.white,
  },
  traveltxt: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: fontFamily.medium,
  },
  daytxt: {
    fontSize: 12,
    color: Colors.secondaryfont,
    fontFamily: fontFamily.regular,
    marginTop: verticalScale(4),
  },
  arrowcon: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(20),
    backgroundColor: Colors.primaryblue,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CollectionScreen;
