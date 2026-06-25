import dayjs from 'dayjs';
import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Colors} from '../Styles/colors';
import fontFamily from '../Styles/fontFamily';
import {moderateScale} from '../Styles/responsiveSize';

interface CustomDateRangePickerProps {
  placeholder?: string;
  onRangeSelect?: (start: string, end: string) => void;
  days: number; // e.g. 8
  nights: number; // e.g. 7
  bgColor?: string;
  textColor?: string;
  padding?: number;
  setSelectedCustomDate: any;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  placeholder = 'Choose your own dates',
  onRangeSelect,
  days,
  bgColor = Colors.primaryblue,
  textColor = Colors.white,
  padding = 10,
  setSelectedCustomDate,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const showCalendar = () => setIsVisible(true);
  const hideCalendar = () => setIsVisible(false);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDayPress = (day: {dateString: string}) => {
    const start = day.dateString;
    setStartDate(start);

    // calculate end date using days prop
    const startDateObj = new Date(start);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(startDateObj.getDate() + days - 1); // subtract 1 because start date counts as day 1
    const calculatedEnd = formatDate(endDateObj);

    setEndDate(calculatedEnd);
    onRangeSelect?.(start, calculatedEnd);

    // hideCalendar();
  };

  const getMarkedDates = () => {
    let marked: any = {};
    if (startDate) {
      marked[startDate] = {
        startingDay: true,
        color: Colors.primaryblue,
        textColor: Colors.white,
      };
    }
    if (endDate) {
      marked[endDate] = {
        endingDay: true,
        color: Colors.primaryblue,
        textColor: Colors.white,
      };

      // fill in-between dates
      let current = new Date(startDate!);
      const end = new Date(endDate);
      while (current < end) {
        const dateStr = current.toISOString().split('T')[0];
        if (dateStr !== startDate) {
          marked[dateStr] = {color: Colors.skyblue, textColor: Colors.black};
        }
        current.setDate(current.getDate() + 1);
      }
    }
    return marked;
  };

  const formattedLabel = () => {
    if (startDate && endDate) {
      setSelectedCustomDate(
        `${dayjs(startDate).format('DD MMMM YYYY').toUpperCase()} - ${dayjs(
          endDate,
        )
          .format('DD MMMM YYYY')
          .toUpperCase()}`,
      );
      return `${dayjs(startDate)
        .format('DD MMMM YYYY')
        .toUpperCase()} - ${dayjs(endDate)
        .format('DD MMMM YYYY')
        .toUpperCase()}`;
    }
    if (startDate) {
      setSelectedCustomDate(`${dayjs(startDate).format('DD MMMM YYYY')}`);
      return `${dayjs(startDate).format('DD MMMM YYYY')}`;
    }
    return placeholder;
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.dateQuentityCon,
          {
            backgroundColor: bgColor,
            padding: padding,
          },
        ]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.8}>
        <Text
          style={[
            styles.selectedText,
            {
              color: textColor,
            },
          ]}>
          {formattedLabel()}
        </Text>
      </TouchableOpacity>

      <Modal visible={isVisible} animationType="fade" transparent={true}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setIsVisible(false);
          }}
          style={styles.modalContainer}>
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true} // Capture touch events
            onResponderRelease={e => e.stopPropagation()} // Prevent propagation
          >
            <Calendar
              theme={{
                textDisabledColor: '#0000002f',
              }}
              minDate={today}
              onDayPress={handleDayPress}
              markingType="period"
              markedDates={getMarkedDates()}
            />

            <Pressable
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}>
              <Text style={{color: Colors.white, fontWeight: '600'}}>Done</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectedText: {
    fontSize: moderateScale(14),
    fontFamily: fontFamily.regular,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    margin: 20,
    borderRadius: 15,
    padding: 15,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: Colors.primaryblue,
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  dateQuentityCon: {
    backgroundColor: Colors.skyblue,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CustomDateRangePicker;
