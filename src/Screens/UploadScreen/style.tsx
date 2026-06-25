import {StyleSheet} from 'react-native';
import {Colors} from '../../Utilities/Styles/colors';
import {
  height,
  moderateScale,
  width,
} from '../../Utilities/Styles/responsiveSize';

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    borderRadius: 42,
    height: 45,
    color: Colors.black,
  },
  selectedImage: {
    width: width * 0.9,
    height: height * 0.3,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  defaultImage: {
    width: width * 0.9,
    height: height * 0.3,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#D9D9D9',
    resizeMode: 'contain',
  },
  consentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gentlegrey,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primaryblue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  consentText: {
    fontSize: 12,
    color: Colors.secondaryfont,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
});
export default styles;
