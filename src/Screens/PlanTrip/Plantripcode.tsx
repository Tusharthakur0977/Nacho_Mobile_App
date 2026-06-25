import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePath from '../../Utilities/Constants/ImagePath';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {CommonBtn, SizeBox} from '../../Utilities/Component/hooks/Helpers';
import styles from './style';
import {Colors} from '../../Utilities/Styles/colors';
import StepIndicator from 'react-native-step-indicator';
import VectorIcon from 'react-native-vector-icons/FontAwesome';
import {
  height,
  moderateScale,
  moderateScaleVertical,
} from '../../Utilities/Styles/responsiveSize';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TabRoutes from '../../Navigation/TabRoutes';

const PlanTrip = ({navigation}: any) => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isYesSelected, setIsYesSelected] = useState(false);
  const [isNoSelected, setIsNoSelected] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [HotelBooking, setHotelBooking] = useState(false);
  const [SeparateHotel, setSeparateHotel] = useState(false);
  const [days, setDays] = useState([{day: 'Day 1', activity: '', key: '1'}]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateType, setDateType] = useState<'dob' | 'expiry' | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Show Date Picker
  const showDatePicker = (type: 'dob' | 'expiry') => {
    setDateType(type);
    setTimeout(() => setDatePickerVisibility(true), 100);
  };

  // Hide Date Picker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Handle Date Selection
  const handleConfirm = (date: Date) => {
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (dateType === 'dob') {
      setSelectedDate(formattedDate);
    } else if (dateType === 'expiry') {
      setExpiryDate(formattedDate);
    }

    hideDatePicker();
  };

  const data = [
    {id: '1', name: 'hiking'},
    {id: '2', name: 'kayaking'},
    {id: '3', name: 'sightseeing'},
    {id: '4', name: 'bird_watching'},
    {id: '5', name: 'swimming'},
    {id: '6', name: 'camping'},
    {id: '7', name: 'photography'},
    {id: '8', name: 'fishing'},
    {id: '9', name: 'horse_riding'},
    {id: '10', name: 'cultural_tour'},
  ];

  const handlePress = (itemId, itemName, dayKey) => {
    const updatedDays = days.map(day => {
      if (day.key === dayKey) {
        const activities = day.activity.split(', ').filter(Boolean);
        const index = activities.indexOf(itemName);

        if (index > -1) {
          activities.splice(index, 1);
        } else {
          activities.push(itemName);
        }

        return {...day, activity: activities.join(', ')};
      }
      return day;
    });

    setDays(updatedDays);

    setSelectedItems(prevSelectedItems => {
      const newSelectedItems = [...prevSelectedItems];
      const index = newSelectedItems.indexOf(itemId);

      if (index > -1) {
        newSelectedItems.splice(index, 1);
      } else {
        newSelectedItems.push(itemId);
      }
      return newSelectedItems;
    });
  };

  const handleAddDay = () => {
    const nextDay = days.length + 1;
    const newDay = {day: `Day ${nextDay}`, activity: '', key: `${nextDay}`};
    setDays([...days, newDay]);
  };

  const renderItem = ({item}) => (
    <View>
      <Text style={{...commonStyles.font14Bold}}>{item.day}</Text>
      <SizeBox size={5} />
      <Text style={{...commonStyles.font14Bold}}>Activities</Text>
      <SizeBox size={5} />
      <TextInput
        style={[
          styles.textInput,
          {
            height: height / 4,
            borderRadius: 10,
            padding: 10,
            textAlignVertical: 'top',
          },
        ]}
        multiline={true}
        value={item.activity}
        editable={false}
      />
      <SizeBox size={5} />
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item: innerItem}) => (
          <View style={{flexDirection: 'row', marginRight: 15}}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                item.activity.includes(innerItem.name) && styles.selected,
              ]}
              activeOpacity={0.8}
              onPress={() =>
                handlePress(innerItem.id, innerItem.name, item.key)
              }>
              {item.activity.includes(innerItem.name) && (
                <VectorIcon
                  groupName="AntDesign"
                  name="check"
                  size={14}
                  style={styles.righttick}
                  color={Colors.white}
                />
              )}
            </TouchableOpacity>
            <Text style={{...commonStyles.font12Regular, marginLeft: 7}}>
              {innerItem.name}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        style={{flexWrap: 'wrap', flexDirection: 'row'}}
      />
      <SizeBox size={10} />
    </View>
  );
  const handleYesPress = () => {
    setIsYesSelected(true);
    setIsNoSelected(false);
  };

  const handleNoPress = () => {
    setIsNoSelected(true);
    setIsYesSelected(false);
  };

  const HandleSpecificHotelBooking = () => {
    setHotelBooking(true);
    setSeparateHotel(false);
  };

  const HandleSeparateHotelBooking = () => {
    setHotelBooking(false);
    setSeparateHotel(true);
  };

  const steps = [
    'Fill in your details',
    'Add fare',
    'Hotel Type',
    'Choose Your Dates',
    'City of Departure',
    'Daily Itinerary',
  ];

  const customStyles = {
    stepIndicatorSize: 15,
    currentStepIndicatorSize: 15,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Colors.primaryblue,
    stepStrokeFinishedColor: Colors.primaryblue,
    stepStrokeUnFinishedColor: Colors.grey,
    separatorFinishedColor: Colors.primaryblue,
    separatorUnFinishedColor: Colors.grey,
    stepIndicatorFinishedColor: Colors.primaryblue,
    stepIndicatorUnFinishedColor: Colors.grey,
    stepIndicatorCurrentColor: Colors.primaryblue,
    stepIndicatorLabelFontSize: 1,
    currentStepIndicatorLabelFontSize: 1,
    stepIndicatorLabelCurrentColor: Colors.primaryblue,
    stepIndicatorLabelFinishedColor: Colors.transparent,
    stepIndicatorLabelUnFinishedColor: Colors.transparent,
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView
        extraScrollHeight={100}
        style={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginTop: Platform.OS === 'android' ? 20 : 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (currentPosition === 0) {
                navigation.goBack();
              } else {
                setCurrentPosition(prev => Math.max(prev - 1, 0));
              }
            }}
            activeOpacity={0.7}>
            <Image
              source={ImagePath.backClick}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
          <Text
            style={{
              ...commonStyles.font20navy,
              marginLeft: 20,
            }}>
            Create Custom Trip
          </Text>
        </View>
        <SizeBox size={10} />
        <View style={{paddingHorizontal: 20}}>
          <Text style={{...commonStyles.font16Regular}}>
            Step {currentPosition + 1}
          </Text>
          <SizeBox size={10} />
          <StepIndicator
            labels={false}
            customStyles={customStyles}
            currentPosition={currentPosition}
            stepCount={steps.length}
          />
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepText}>{steps[currentPosition]}</Text>
          </View>
          <SizeBox size={10} />
          {currentPosition === 0 && (
            <>
              <TextInput
                style={styles.textInput}
                placeholder="Enter full name"
                placeholderTextColor={Colors.greyTxt}
              />
              <SizeBox size={5} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter email or phone number"
                placeholderTextColor={Colors.greyTxt}
              />
              <SizeBox size={10} />
              <Text style={{...commonStyles.font12Bold, fontWeight: '700'}}>
                Destination offered
              </Text>
              <SizeBox size={10} />
              <View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter destination"
                  placeholderTextColor={Colors.greyTxt}
                />
                <VectorIcon
                  groupName="FontAwesome"
                  name="angle-down"
                  size={20}
                  color={Colors.secondaryfont}
                  style={{
                    position: 'absolute',
                    right: 15,
                    top: 13,
                  }}
                />
              </View>
            </>
          )}
          {currentPosition === 1 && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {/* Yes Button */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={[
                    styles.fareyesbtn,
                    {
                      backgroundColor: HotelBooking
                        ? Colors.primaryblue
                        : Colors.white,
                    },
                  ]}
                  activeOpacity={0.6}
                  onPress={HandleSpecificHotelBooking}>
                  <View style={styles.innerview} />
                </TouchableOpacity>
                <Text style={{...commonStyles.font10Bold, marginLeft: 7}}>
                  Yes
                </Text>
              </View>

              {/* No Button */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={[
                    styles.fareyesbtn,
                    {
                      backgroundColor: SeparateHotel
                        ? Colors.primaryblue
                        : Colors.white,
                    },
                  ]}
                  activeOpacity={0.6}
                  onPress={HandleSeparateHotelBooking}>
                  <View style={styles.innerview} />
                </TouchableOpacity>
                <Text style={{...commonStyles.font10Bold, marginLeft: 7}}>
                  No
                </Text>
              </View>
              <Text />
              <View />
            </View>
          )}
          {currentPosition === 2 && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {/* Yes Button */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={[
                    styles.fareyesbtn,
                    {
                      backgroundColor: isYesSelected
                        ? Colors.primaryblue
                        : Colors.white,
                    },
                  ]}
                  activeOpacity={0.6}
                  onPress={handleYesPress}>
                  <View style={styles.innerview} />
                </TouchableOpacity>
                <Text style={{...commonStyles.font10Bold, marginLeft: 7}}>
                  Book from specific hotels
                </Text>
              </View>

              {/* No Button */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={[
                    styles.fareyesbtn,
                    {
                      backgroundColor: isNoSelected
                        ? Colors.primaryblue
                        : Colors.white,
                    },
                  ]}
                  activeOpacity={0.6}
                  onPress={handleNoPress}>
                  <View style={styles.innerview} />
                </TouchableOpacity>
                <Text style={{...commonStyles.font10Bold, marginLeft: 7}}>
                  Book your hotel separately
                </Text>
              </View>
            </View>
          )}
          {currentPosition === 3 && (
            <View style={styles.dateContainer}>
              <View style={styles.dateInput}>
                <Text style={styles.label}>Tour Start Date</Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => showDatePicker('dob')}
                  style={[
                    styles.inputfielddob,
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text>{selectedDate ? selectedDate : 'DD/MM/YYYY'}</Text>

                  <VectorIcon
                    groupName="Feather"
                    name="calendar"
                    size={20}
                    color={Colors.black}
                    onPress={() => showDatePicker('dob')}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.dateInput}>
                <Text style={styles.label}>Tour End Date</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => showDatePicker('expiry')}
                  style={[
                    styles.inputfielddob,
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text>{expiryDate ? expiryDate : 'DD/MM/YYYY'}</Text>

                  <VectorIcon
                    groupName="Feather"
                    name="calendar"
                    size={20}
                    color={Colors.black}
                    onPress={() => showDatePicker('expiry')}
                  />
                </TouchableOpacity>
              </View>
              {/* Date Picker */}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                display="spinner"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          )}
          {currentPosition === 4 && (
            <TextInput
              style={styles.textInput}
              placeholder="City"
              placeholderTextColor={Colors.greyTxt}
            />
          )}
          {currentPosition === 5 && (
            <View>
              <FlatList
                data={days}
                renderItem={renderItem}
                keyExtractor={item => item.key}
              />
              <SizeBox size={10} />
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primaryblue,
                  padding: 10,
                  width: '30%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                }}
                onPress={handleAddDay}>
                <Text style={{...commonStyles.font14Bold, color: Colors.white}}>
                  Add Day
                </Text>
              </TouchableOpacity>
              <SizeBox size={10} />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      <View style={{paddingHorizontal: 20}}>
        <CommonBtn
          onPress={() => {
            if (currentPosition === steps.length - 1) {
              navigation.goBack();
            } else {
              setCurrentPosition(prev => Math.min(prev + 1, steps.length - 1));
            }
          }}
          title="Next"
        />
      </View>
      <SizeBox size={20} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stepTextContainer: {
    marginTop: 20,
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    paddingLeft: 20,
    paddingRight: 30,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    borderRadius: 42,
    height: 45,
    color: Colors.black,
  },
  icon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{translateY: -10}],
  },
  fareyesbtn: {
    borderWidth: 5,
    borderRadius: 10,
    height: 20,
    width: 20,
    borderColor: Colors.grey,
  },
  innerview: {
    height: 10,
    width: 10,
    borderRadius: 10,
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
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    ...commonStyles.font14Regular,
  },
  arrowcon: {
    width: moderateScaleVertical(36),
    height: moderateScale(36),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryblue,
  },
  checkbox: {
    width: 20,
    height: 20,
    backgroundColor: Colors.white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: Colors.primaryblue,
    borderColor: Colors.primaryblue,
  },
  righttick: {
    marginLeft: 0,
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
});

export default PlanTrip;
