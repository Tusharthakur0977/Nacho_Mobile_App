import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import ImagePath from '../../Utilities/Constants/ImagePath';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {
  CommonBtn,
  CommonInput,
  SizeBox,
} from '../../Utilities/Component/hooks/Helpers';
import styles from './style';
import {Colors} from '../../Utilities/Styles/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadFeedImageApi} from '../../Utilities/Constants/requestHandler';
import Toast from 'react-native-toast-message';
import {useAppSelector} from '../../Redux/store';

const UploadScreen = ({navigation}: any) => {
  // State to store the selected image
  const {user} = useAppSelector(state => state.user);
  const [loader, setLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [title, setTitle] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const addImg = () => {
    ImagePicker.openPicker({
      cropping: true,
      compressImageQuality: 1,
      width: 1200,
      height: 1200,
      mediaType: 'photo',
    })
      .then(image => {
        setSelectedImage(image);
      })
      .catch(error => {
        console.log('Image picker error:', error);
      });
  };

  const handleNextOrUpload = () => {
    if (selectedImage) {
      if (selectedImage?.path === undefined) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please select the image!!',
        });
        return;
      }
      if (!title) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please enter loaction name!!',
        });
        return;
      }
      if (!consentChecked) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2:
            'Please accept the terms to upload images for public view and marketing!!',
        });
        return;
      }
      setLoader(true);
      uploadFeedImageApi(title, selectedImage, user?.id)
        .then(res => {
          setLoader(false);
          if (res.status_text === 'Success') {
            Toast.show({
              type: 'success',
              text1: 'Upload Successful',
              text2: 'Your image has been submitted for admin approval.',
            });
            setTimeout(() => {
              navigation.goBack();
            }, 1500);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Something went wrong!!',
            });
          }
        })
        .catch(error => {
          setLoader(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error,
          });
          console.error('Upload failed:', error);
        });
    } else {
      ImagePicker.openPicker({
        cropping: true,
        compressImageQuality: 1,
        width: 1200,
        height: 1200,
        mediaType: 'photo',
      })
        .then(image => {
          setSelectedImage(image);
        })
        .catch(err => console.log('Image picker error:', err));
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          position: 'absolute',
          top: 15,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
        <Toast />
      </View>
      <KeyboardAwareScrollView
        extraScrollHeight={100}
        style={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
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
            Upload Image
          </Text>
        </View>
        <SizeBox size={10} />
        <View style={{paddingHorizontal: 20}}>
          <TouchableOpacity activeOpacity={0.6} onPress={() => addImg()}>
            <Image
              source={
                selectedImage?.path
                  ? {uri: selectedImage?.path}
                  : ImagePath.AddImage
              }
              style={
                selectedImage?.path ? styles.selectedImage : styles.defaultImage
              }
            />
          </TouchableOpacity>
          <SizeBox size={10} />
          <TextInput
            value={title}
            onChangeText={text => setTitle(text)}
            style={styles.textInput}
            placeholder="Enter Location"
            placeholderTextColor={Colors.greyTxt}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={{paddingHorizontal: 20, marginBottom: 15}}>
        <TouchableOpacity
          style={styles.consentContainer}
          onPress={() => setConsentChecked(!consentChecked)}
          activeOpacity={0.7}>
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: consentChecked
                  ? Colors.primaryblue
                  : Colors.white,
              },
            ]}>
            {consentChecked && (
              <Text
                style={{color: Colors.white, fontSize: 14, fontWeight: 'bold'}}>
                ✓
              </Text>
            )}
          </View>
          <Text style={styles.consentText}>
            I agree that the uploaded photos can be used for public view and
            marketing purposes
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingHorizontal: 20,
        }}>
        {loader ? (
          <ActivityIndicator size="large" color={Colors.primaryblue} />
        ) : (
          <CommonBtn
            onPress={handleNextOrUpload}
            title="Upload"
            isDisabled={!consentChecked}
          />
        )}
      </View>
      <SizeBox size={20} />
    </SafeAreaView>
  );
};

export default UploadScreen;
