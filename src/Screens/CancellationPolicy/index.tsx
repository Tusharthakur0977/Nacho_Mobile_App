import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import ImagePath from '../../Utilities/Constants/ImagePath';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import styles from './styles';

const CancellationPolicy = ({navigation}: any) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          marginTop: Platform.OS == 'android' ? 20 : 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Image source={ImagePath.backClick} style={{width: 40, height: 40}} />
        </TouchableOpacity>
        <Text
          style={{
            ...commonStyles.font20navy,
            marginLeft: 20,
          }}>
          Cancellation Policy
        </Text>
      </View>
      <SizeBox size={10} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.datecontainer}>
          <Text style={styles.welcometxt}>
            Trip Cancellation and Transfer Policy CANCELLATION AND REFUND
            POLICY:
          </Text>
          <SizeBox size={10} />
          <Text style={styles.policytxt}>
            There is a $1,500 non-refundable/non-transferable deposit $1500 per
            person (included in total cost and cannot be used for a future
            program upon cancellation or transfer).This deposit is
            non-refundable and non-transferable. This indicates no credits,
            transfers, or refunds will be provided for the deposit paid. If a
            request for cancellation from the program is made prior to 4 weeks
            from the start date of the program, any amount paid will be refunded
            to the original method of payment for this program less the $1500
            deposit per person. If a request for cancellation occurs within 4
            weeks from the start date of program, all amounts paid are
            non-refundable and non-transferable. This indicates no credits,
            transfers, or refunds will be provided for any amount paid if
            cancellation takes place within 4 weeks from the program start date.
          </Text>
          <SizeBox size={10} />
          <Text style={styles.welcometxt}>
            TO PROTECT YOUR INVESTMENT, WE RECOMMEND THAT YOU PURCHASE TRIP
            CANCELLATION INSURANCE:
          </Text>
          <SizeBox size={10} />
          <Text style={styles.policytxt}>
            Travelex: Great Travel Insurance at the Right Price
            (travelexinsurance.com)
          </Text>
          <SizeBox size={10} />
          <Text style={styles.policytxt}>
            *By submitting your contact information you express written
            authorization to contact you via automated email, text, or other
            messaging technology to send reminders, new updates and share
            additional services or products provided.*
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CancellationPolicy;
