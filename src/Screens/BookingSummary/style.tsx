import {StyleSheet} from 'react-native';
import {Colors} from '../../Utilities/Styles/colors';
import {height} from '../../Utilities/Styles/responsiveSize';
import fontFamily from '../../Utilities/Styles/fontFamily';

const styles = StyleSheet.create({
  updateimgbtn: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    bottom: 40,
    right: 10,
    padding: 10,
    borderRadius: 22,
  },
  profilecon: {
    backgroundColor: Colors.white,
    top: -50,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  countrytxt: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    color: Colors.black,
    marginLeft: 10,
  },
  countryimgcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datetxt: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
    color: Colors.textgrey,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  txtouterview: {
    backgroundColor: Colors.skyblue,
    padding: 10,
    borderRadius: 39,
  },
  dates: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: Colors.navyblue,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  placeserveytxt: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: Colors.secondaryfont,
    fontWeight: '500',
    textAlign: 'justify',
  },
  overviewtxt: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: Colors.navyblue,
    fontWeight: '700',
  },
  dayphase: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: Colors.secondaryfont,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
export default styles;
