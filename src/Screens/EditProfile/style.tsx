import {StyleSheet} from 'react-native';
import {height} from '../../Utilities/Styles/responsiveSize';
import {Colors} from '../../Utilities/Styles/colors';

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: height / 2.9,
    justifyContent: 'flex-end',
  },
  updateimgbtn: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    bottom: 40,
    right: 10,
    padding: 10,
    borderRadius: 22,
  },
  editedprofilecon: {
    backgroundColor: Colors.white,
    top: -30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    // height: height / 2,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.secondaryfont,
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: '500',
  },
  textInput: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.greytext,
    borderRadius: 42,
    height: 45,

    color: Colors.black,
  },
  countryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  callingCodeText: {
    fontSize: 14,
  },
  textInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.greytext,
    borderRadius: 42,
    height: 45,
    color: Colors.black,
  },
});
export default styles;
