import {Dimensions, Platform, StatusBar} from 'react-native';
const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: any) => (width / guidelineBaseWidth) * size;

const verticalScale = (size: any) => (height / guidelineBaseHeight) * size;

const moderateScale = (size: any, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const moderateScaleVertical = (size: any, factor = 0.5) =>
  size + (verticalScale(size) - size) * factor;

const textScale = (percent: any) => {
  const screenHeight = Dimensions.get('window').height;
  const ratio =
    Dimensions.get('window').height / Dimensions.get('window').width;
  const deviceHeight = 375
    ? screenHeight * (ratio > 1.8 ? 0.14 : 0.15)
    : Platform.OS === 'android'
    ? screenHeight - (StatusBar.currentHeight ?? 0)
    : screenHeight;
  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
};

export {
  scale,
  verticalScale,
  textScale,
  moderateScale,
  moderateScaleVertical,
  width,
  height,
};
