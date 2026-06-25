import {StyleSheet} from 'react-native';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';
import {moderateScale, height} from '../../Utilities/Styles/responsiveSize';

const styles = StyleSheet.create({
  fixedControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
  },
  imageBackground: {
    width: '100%',
    height: height,
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dealtxt: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 33.56,
    color: Colors.white,
    fontFamily: fontFamily.regular,
  },
  dealdesctxt: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    lineHeight: 22,
    textAlign: 'center',
    color: Colors.greytext,
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  buttontxt: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fontFamily.regular,
    color: Colors.white,
  },
  skipbtn: {
    backgroundColor: Colors.skipgrey,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: moderateScale(130),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Nextbtn: {
    backgroundColor: Colors.primaryblue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: moderateScale(130),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slidebtn: {
    height: 3,
    width: 12,
    backgroundColor: Colors.skipgrey,
    borderRadius: 17,
  },
});

export default styles;
