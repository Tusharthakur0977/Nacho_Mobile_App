import {StyleSheet} from 'react-native';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {moderateScale, width} from '../../Utilities/Styles/responsiveSize';

const styles = StyleSheet.create({
  profilecon: {
    backgroundColor: Colors.white,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
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
  datecontainer: {
    backgroundColor: Colors.skyblue,
    padding: 10,
    borderRadius: 10,
  },
  phonetxt: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
    color: Colors.secondaryfont,
  },
  outerview: {
    backgroundColor: Colors.gentlegrey,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  imageview: {
    backgroundColor: Colors.white,
    width: 31,
    height: 31,
    borderRadius: 15.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingtxt: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    fontWeight: 600,
    color: Colors.navyblue,
    marginLeft: 15,
  },
  bottomline: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.white,
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  addHomeButton: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
  },
  modalTitle: {
    ...commonStyles.font20navy,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: Colors.grey,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButton: {
    padding: 10,
    backgroundColor: Colors.primaryblue,
    borderRadius: 5,
    marginTop: 15,
  },
  saveButtonText: {
    ...commonStyles.font14Center,
  },
  closeModalButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: Colors.red,
    borderRadius: 5,
  },
  closeModalText: {
    ...commonStyles.font14Center,
  },

  confirmationModalContainer: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: moderateScale(20),
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginBottom: moderateScale(20),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    padding: moderateScale(10),
    borderRadius: 8,
    marginHorizontal: moderateScale(5),
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default styles;
