import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchAdmiApi} from '../../Utilities/Constants/requestHandler';
import {useAppDispatch, useAppSelector} from '../../Redux/store';
import {
  removeImage,
  setNewImages,
} from '../../Redux/Slices/UserSlice/UserSlice';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {height, moderateScale, width} from '../../Utilities/Styles/responsiveSize';
import {PulsingPlaceholder} from '../Feed';

export const updateFeedStatus = async (feedId: any, status: string) => {
  const url = 'https://httpsevolution35app.com/api/feed-status';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: feedId,
        status: status,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to update feed status:', error);
    throw error;
  }
};

const ImageApprovals = ({navigation}: any) => {
  const dispatch = useAppDispatch();

  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {newImages} = useAppSelector(state => state.user);

  const [imageLoadingStatus, setImageLoadingStatus] = useState<
    Record<string, boolean>
  >({});

  const [buttonLoadingStatus, setButtonLoadingStatus] = useState<
    Record<string, {approve: boolean; disapprove: boolean}>
  >({});

  const getImagesForApproval = async () => {
    setLoader(true);
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

  const handleApprove = async (imageId: any) => {
    setButtonLoadingStatus(prev => ({
      ...prev,
      [imageId]: {...prev[imageId], approve: true},
    }));
    try {
      const res = await updateFeedStatus(imageId, '1');

      if (res.status_text === 'Success') {
        // Filter out the approved image from the local state
        dispatch(removeImage(imageId));
      } else {
        console.error('Failed to approve image:', res);
      }
    } catch (error) {
      console.error('Error approving image:', error);
    } finally {
      setButtonLoadingStatus(prev => ({
        ...prev,
        [imageId]: {...prev[imageId], approve: false},
      }));
    }
  };

  const handleDisapprove = async (imageId: any) => {
    setButtonLoadingStatus(prev => ({
      ...prev,
      [imageId]: {...prev[imageId], disapprove: true},
    }));
    try {
      const res = await updateFeedStatus(imageId, '2');
      if (res.status_text === 'Success') {
        // Filter out the disapproved image from the local state
        dispatch(removeImage(imageId));
      } else {
        console.error('Failed to disapprove image:', res);
      }
    } catch (error) {
      console.error('Error disapproving image:', error);
    } finally {
      setButtonLoadingStatus(prev => ({
        ...prev,
        [imageId]: {...prev[imageId], disapprove: false},
      }));
    }
  };

  const renderItem = ({item}: any) => (
    <View style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        {imageLoadingStatus[item.id] && <PulsingPlaceholder />}
        <Image
          source={{uri: item.formated_url}}
          style={styles.image}
          onLoadStart={() =>
            setImageLoadingStatus(prev => ({...prev, [item.id]: true}))
          }
          onLoadEnd={() =>
            setImageLoadingStatus(prev => ({...prev, [item.id]: false}))
          }
        />
      </View>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(item.id)}>
            {buttonLoadingStatus[item.id]?.approve ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Approve</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.disapproveButton]}
            onPress={() => handleDisapprove(item.id)}>
            {buttonLoadingStatus[item.id]?.disapprove ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Disapprove</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getImagesForApproval();
    setRefreshing(false);
  };

  useEffect(() => {
    getImagesForApproval();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, padding: 20}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: moderateScale(10),
          marginBottom: 20,
        }}
        activeOpacity={0.7}>
        <Image source={ImagePath.backClick} style={{width: 40, height: 40}} />
        <Text style={{fontSize: 24}}>Uploaded Images</Text>
      </TouchableOpacity>
      {loader ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={newImages}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            // 👈 Add this section
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: height * 0.7,
                }}>
                <Text style={{fontSize: 20}}>No image Available</Text>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ImageApprovals;

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: moderateScale(20),
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(4),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(6),
    elevation: moderateScale(8),
  },
  imageWrapper: {
    width: '100%',
    height: moderateScale(250),
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentWrapper: {
    padding: moderateScale(15),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: moderateScale(15),
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  actionButton: {
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: moderateScale(3),
    minWidth: width*0.3,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  disapproveButton: {
    backgroundColor: '#F44336',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
