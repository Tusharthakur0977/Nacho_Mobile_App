import React from 'react';
import {View, Image, SafeAreaView, TouchableOpacity, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import {CHECKOUT_URL} from '../../Utilities/Constants/Urls';
import ImagePath from '../../Utilities/Constants/ImagePath';
import styles from './style';
import NavigationStrings from '../../Utilities/Constants/NavigationStrings';

const WebViewScreen = ({navigation, route}: any) => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate(NavigationStrings.TabRoutes)}
          activeOpacity={0.7}>
          <Image source={ImagePath.backClick} style={styles.backButton} />
        </TouchableOpacity>
      </View>
      <WebView
        source={{
          uri: route?.params?.checkOutUrl,
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

export default WebViewScreen;
