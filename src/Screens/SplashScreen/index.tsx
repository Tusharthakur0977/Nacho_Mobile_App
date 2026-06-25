import React from 'react';
import {View, Image, SafeAreaView} from 'react-native';
import {height} from '../../Utilities/Styles/responsiveSize';
import ImagePath from '../../Utilities/Constants/ImagePath';

const SplashScreen = ({}: any) => {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.replace('OnBoarding');
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [navigation]);

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Image
        source={ImagePath.AppLogo}
        style={{width: '100%', height: height}}
      />
    </View>
  );
};

export default SplashScreen;
