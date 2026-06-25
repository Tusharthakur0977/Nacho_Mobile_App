import {Platform, StyleSheet} from 'react-native';
import {Colors} from '../../Utilities/Styles/colors';
import commonStyles from '../../Utilities/Styles/commonStyles';

const styles = StyleSheet.create({
  formcontainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: Colors.black,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 42,
    borderColor: Colors.gentlegrey,
    paddingHorizontal: 10,
    height: 45,
    borderWidth: 1.5,
    width: '100%',
    justifyContent: 'center',
  },
  input: {
    paddingRight: 2,
    ...commonStyles.font14Regular,
  },
  signatureImage: {
    width: '90%',
    height: 70,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  signatureContainer: {
    width: '80%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    width: '100%',
  },
  setButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: Colors.white,
    padding: 20,
  },
  modalHeadersection: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  inputfield: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
  },
  inputfielddob: {
    width: '100%',
    paddingVertical: Platform.OS === 'ios' ? 10 : 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
  },
  nextButton: {
    backgroundColor: Colors.primaryblue,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonTxt: {
    color: Colors.white,
    fontSize: 16,
  },
});
export default styles;
