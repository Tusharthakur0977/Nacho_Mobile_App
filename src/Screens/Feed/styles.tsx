import {Platform, StyleSheet} from 'react-native';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../Utilities/Styles/responsiveSize';
import {Colors} from '../../Utilities/Styles/colors';
import fontFamily from '../../Utilities/Styles/fontFamily';

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width:
      Platform.OS === 'ios'
        ? moderateScaleVertical(120)
        : moderateScaleVertical(115),
    height: Platform.OS === 'ios' ? moderateScale(120) : moderateScale(115),
    borderRadius: 1,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 5,
  },
  flatListContainer: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width / 1.18,
    height: height / 1.6,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  buttonContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.black,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletebtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default styles;
