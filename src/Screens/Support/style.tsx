import {StyleSheet} from 'react-native';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';

const styles = StyleSheet.create({
  datecontainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 10,
  },
  phonetxt: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    color: Colors.secondaryfont,
  },
  chatButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    padding: 5,
    borderRadius: 30,
    backgroundColor: Colors.white,
  },
  image: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    marginVertical: 8,
    textDecorationLine: 'underline',
  },
});
export default styles;
