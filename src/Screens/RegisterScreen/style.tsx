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
  RegisterContainer: {
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
  textInput: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.greytext,
    borderRadius: 42,
    height: 45,
    paddingLeft: 10,
    color: Colors.black,
  },
  passwordtxtipt: {
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.greytext,
    borderRadius: 42,
    height: 45,
    paddingLeft: 10,
    color: Colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // *** EXISTING CHECKBOX STYLES ***
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1, // Added border for better visibility
    borderColor: Colors.greytext, // Use a neutral color for border
    backgroundColor: Colors.white, // Default background
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.primaryblue, // Use primary color for checked state
    borderColor: Colors.primaryblue,
  },
  // *** NEW CHECKBOX STYLES ***
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.black,
    fontFamily: fontFamily.regular,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18, // Adjust to center the checkmark
  },
  // *** END NEW CHECKBOX STYLES ***
  textInputContainer: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.greytext,
    borderRadius: 42,
    height: 45,
    paddingLeft: 10,
    color: Colors.black,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  countryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  callingCodeText: {
    fontSize: 14,
  },
});
export default styles;
