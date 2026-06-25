import {StyleSheet} from 'react-native';
import {Colors} from '../Styles/colors';
import fontFamily from '../Styles/fontFamily';
import commonStyles from '../Styles/commonStyles';

const styles = StyleSheet.create({
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.navyblue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 39,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: Colors.greytext,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: fontFamily.regular,
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
  dates: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: Colors.navyblue,
    fontWeight: '600',
    fontStyle: 'italic',
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
  },
  input: {
    paddingRight: 2,
    ...commonStyles.font14Regular,
  },
});
export default styles;