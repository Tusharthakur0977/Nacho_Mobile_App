import {StyleSheet} from 'react-native';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';

const styles = StyleSheet.create({
  datecontainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  welcometxt: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fontFamily.regular,
    color: Colors.navyblue,
  },
  policytxt: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    color: Colors.secondaryfont,
    textAlign: 'justify',
  },
});
export default styles;
