import {StyleSheet} from 'react-native';
import {moderateScale, verticalScale} from '../../Utilities/Styles/responsiveSize';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';

const styles = StyleSheet.create({
  outerview: {
    marginBottom: verticalScale(20),
    borderRadius: 10,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  maintagscontainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: moderateScale(8),
    marginBottom: verticalScale(8),
    flexWrap: 'wrap',
  },
  tagouterview: {
    borderWidth: 0.5,
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: 4,
    borderColor: Colors.gentlegrey,
    backgroundColor: Colors.gentlegrey,
  },
  traveltxt: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: fontFamily.medium,
  },
  daytxt: {
    fontSize: 12,
    color: Colors.secondaryfont,
    fontFamily: fontFamily.regular,
    marginTop: verticalScale(4),
  },
  arrowcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: Colors.primaryblue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
