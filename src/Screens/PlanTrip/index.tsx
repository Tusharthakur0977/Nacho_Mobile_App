import {
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePath from '../../Utilities/Constants/ImagePath';
import commonStyles from '../../Utilities/Styles/commonStyles';
import WebView from 'react-native-webview';
import styles from './style';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';

const PlanTrip = ({navigation}: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          marginTop: Platform.OS === 'android' ? 20 : 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.7}>
          <Image source={ImagePath.backClick} style={{width: 40, height: 40}} />
        </TouchableOpacity>
        <Text
          style={{
            ...commonStyles.font20navy,
            marginLeft: 20,
          }}>
          Create Custom Trip
        </Text>
      </View>
      <SizeBox size={10} />
      <WebView
        source={{
          uri: 'https://evolution35.com/pages/customize-your-trip',
        }}
        style={styles.webView}
        startInLoadingState
        renderError={errorName => (
          <View style={styles.errorContainer}>
            <Text>Error loading page: {errorName}</Text>
          </View>
        )}
        onMessage={event => console.log(event.nativeEvent.data)}
      />
    </SafeAreaView>
  );
};

export default PlanTrip;
