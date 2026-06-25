import {StyleSheet} from 'react-native';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';

const styles = StyleSheet.create({
  datecontainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 20,
  },
  welcometxt: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fontFamily.regular,
    color: Colors.navyblue,
  },
  policytxt: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    color: Colors.secondaryfont,
    textAlign: 'justify',
  },
});

export default styles;
