import {StyleSheet} from 'react-native';
import {Colors} from '../../Utilities/Styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../Utilities/Styles/responsiveSize';
import fontFamily from '../../Utilities/Styles/fontFamily';

const styles = StyleSheet.create({
  outerview: {
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 5,
    marginVertical: 10,
  },
  tabcontainer: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    top: 5,
    right: 5,
    alignSelf: 'flex-end',
  },
  traveltxt: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fontFamily.regular,
    color: Colors.navyblue,
  },
  daytxt: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: fontFamily.regular,
    color: Colors.secondaryfont,
    marginTop: 2,
  },
  arrowcon: {
    width: 36,
    height: 36,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryblue,
    marginRight: 5,
  },
});
export default styles;
