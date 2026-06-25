import {Platform, StyleSheet} from 'react-native';
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
  loginContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  createtxt: {
    fontSize: 12,
    color: Colors.primaryblue,
    marginVertical: 10,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.secondaryfont,
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  keepLoggedInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 20,
    height: 20,
    backgroundColor: Colors.greytext,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.primaryblue,
  },
  keepLoggedInText: {
    color: 'black',
    marginLeft: 10,
  },
  forgotPasswordText: {
    color: Colors.primaryblue,
    marginBottom: 10,
  },
});
export default styles;
