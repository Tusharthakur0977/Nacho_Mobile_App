import {StyleSheet} from 'react-native';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';
import commonStyles from '../../Utilities/Styles/commonStyles';

const styles = StyleSheet.create({
  outercon: {
    backgroundColor: Colors.white,
    width: '100%',
    padding: 10,
    borderRadius: 10,
    position:'relative'
  },
  quentitytxt: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: fontFamily.regular,
    color: Colors.primaryblue,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.navyblue,
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 38,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginBottom: 10,
  },
  booknowbtn: {
    backgroundColor: Colors.primaryblue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 38,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  keyText: {
    ...commonStyles.font12,
    flex: 1, // ensures equal spacing
    textAlign: 'left',
  },
  valueText: {
    ...commonStyles.font12Bold,
    flex: 1, // ensures equal spacing
    textAlign: 'right',
  },
});

export default styles;
