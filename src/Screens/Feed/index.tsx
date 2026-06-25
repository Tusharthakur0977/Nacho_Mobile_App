import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { setNewImages } from '../../Redux/Slices/UserSlice/UserSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/store';
import { SizeBox } from '../../Utilities/Component/hooks/Helpers';
import VectorIcon from '../../Utilities/Component/vectorIcons';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {
  fetchAdmiApi,
  fetchFeedApi,
  uploadDeleteFeedImageApi,
} from '../../Utilities/Constants/requestHandler';
import { Colors } from '../../Utilities/Styles/colors';
import commonStyles from '../../Utilities/Styles/commonStyles';
import { height } from '../../Utilities/Styles/responsiveSize';
import styles from './styles';

export const PulsingPlaceholder = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#e0e0e0',
          opacity,
          ...StyleSheet.absoluteFillObject, // This positions the loader to cover the image container
          borderRadius: 8,
        },
      ]}
    />
  );
};

const emailArray = [
  'info@evolution35.com',
  'harsh@auspicioussoft.com',
  'sofiamagalde@gmail.com',
];

const Feed = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {newImages} = useAppSelector(state => state.user);

  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImg, setCurrentImg] = useState<any>('');
  const [imageLoader, setImageLoader] = useState(false);
  const [feedData, setFeedData] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [imageLoadingStatus, setImageLoadingStatus] = useState<
    Record<string, boolean>
  >({}); // New state for individual image loading
  const {user} = useAppSelector(state => state.user);

  const openModal = (index: number, item: any) => {
    setImageLoader(false);
    setCurrentImg(item);
    setCurrentIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (isFocused) {
      getFeedData();
      getImagesForApproval();
    }
  }, [isFocused]);

  const showToast = (title: string, message: string, type: string) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
    });
  };

  const deleteFeed = async (feedId: string) => {
    setLoader(true);
    try {
      const res = await uploadDeleteFeedImageApi(feedId);
      if (res.status_text === 'Success') {
        setFeedData((prevFeedData: any[]) =>
          prevFeedData.filter(item => item.id !== feedId),
        );
        setModalVisible(false);
        showToast('Success', 'Image deleted successfully!', 'success');
      } else {
        showToast('Error', 'Failed to delete image', 'error');
      }
    } catch (error: any) {
      setModalVisible(false);
      showToast('Error', error.message || 'Something went wrong', 'error');
    } finally {
      setLoader(false);
    }
  };

  const getFeedData = async () => {
    if (!refreshing || feedData.length === 0) {
      setLoader(true);
    }

    try {
      const res = await fetchFeedApi();

      if (res.status_text === 'Success') {
        setFeedData(res?.data);
      } else {
        setFeedData([]);
      }
    } catch (error: any) {
      showToast('Error', error.message || 'Failed to fetch feed', 'error');
      console.error('Get feed failed:', error);
    } finally {
      setLoader(false);
      setRefreshing(false);
    }
  };

  const getImagesForApproval = async () => {
    try {
      const res = await fetchAdmiApi();

      if (res.status_text === 'Success') {
        dispatch(setNewImages(res?.data));
      } else {
        dispatch(setNewImages([]));
      }
    } catch (error: any) {
      console.error('Get feed failed:', error);
    } finally {
      setLoader(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getFeedData();
  }, []);

  const renderItem = ({item, index}: any) => (
    <TouchableOpacity onPress={() => openModal(index, item)}>
      <View style={styles.imageContainer}>
        {imageLoadingStatus[item.id] && <PulsingPlaceholder />}
        <Image
          source={{uri: item?.formated_url}}
          style={styles.image}
          onLoadStart={() =>
            setImageLoadingStatus(prev => ({...prev, [item.id]: true}))
          }
          onLoadEnd={() =>
            setImageLoadingStatus(prev => ({...prev, [item.id]: false}))
          }
        />
      </View>
    </TouchableOpacity>
  );

  if (loader && !refreshing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primaryblue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => <SizeBox size={40} />}
        ListEmptyComponent={() => {
          if (!loader && !refreshing) {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: height * 0.7,
                }}>
                <Text style={{fontSize: 24}}>No image Available</Text>
              </View>
            );
          }
          return null;
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primaryblue}
          />
        }
      />

      {user?.email && emailArray.includes(user?.email) && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            position: 'absolute',
            bottom: Platform.OS === 'android' ? 190 : 180,
            right: 20,
          }}
          onPress={() => navigation.navigate('ImageApprovals')}>
          <Image
            source={ImagePath.GalleryIcon}
            resizeMode="contain"
            style={{
              height: 50,
              width: 50,
            }}
          />
          {newImages.length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -7,
                right: -7,
                backgroundColor: Colors.red,
                borderRadius: 100,
                height: 25,
                width: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white'}}>{newImages.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          bottom: Platform.OS === 'android' ? 90 : 80,
          right: 20,
        }}
        onPress={() => navigation.navigate('UploadScreen')}>
        <Image
          source={ImagePath.Upload}
          resizeMode="contain"
          style={{
            height: 50,
            width: 50,
            bottom: Platform.OS === 'android' ? 2 : 30,
          }}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1, backgroundColor: Colors.greytext}}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={closeModal} activeOpacity={0.7}>
                <Image
                  source={ImagePath.backClick}
                  style={{width: 40, height: 40}}
                />
              </TouchableOpacity>
              {user?.email && emailArray.includes(user?.email) && (
                <TouchableOpacity
                  style={styles.deletebtn}
                  activeOpacity={0.8}
                  onPress={() => deleteFeed(currentImg?.id)}
                  disabled={loader}>
                  <Text style={{...commonStyles.font14, color: Colors.red}}>
                    {loader ? 'Deleting...' : 'Delete'}
                  </Text>
                  <VectorIcon
                    groupName="MaterialCommunityIcons"
                    name="delete"
                    size={20}
                    color={Colors.red}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.modalContainer}>
              <ImageBackground
                borderRadius={10}
                source={{uri: currentImg?.formated_url}}
                resizeMode="contain"
                style={styles.modalImage}>
                {imageLoader && (
                  <View style={styles.loader}>
                    <ActivityIndicator
                      size="large"
                      color={Colors.primaryblue}
                    />
                  </View>
                )}
              </ImageBackground>
              <SizeBox size={10} />
              <Text
                style={{
                  alignSelf: 'flex-start',
                  ...commonStyles.font20navy,
                  paddingHorizontal: 30,
                }}>
                {currentImg?.title}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Feed;
