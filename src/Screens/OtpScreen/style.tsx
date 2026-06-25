import {StyleSheet} from 'react-native';
import {
  height,
  moderateScaleVertical,
  width,
} from '../../Utilities/Styles/responsiveSize';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: height,
    justifyContent: 'flex-end',
  },
  otpContainer: {
    width: '100%',
    height: height / 2.05,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
    paddingHorizontal: 20,
  },
  evolutionImage: {
    height: moderateScaleVertical(44),
    width: width / 2,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.navyblue,
    fontFamily: fontFamily.regular,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.secondaryfont,
    marginVertical: 10,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  pinCodeContainer: {
    borderRadius: 50,
    width: 50,
    height: 50,
    marginHorizontal: 2,
    alignSelf: 'center',
  },
  createtxt: {
    fontSize: 12,
    color: Colors.primaryblue,
    marginVertical: 10,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
});
export default styles;
