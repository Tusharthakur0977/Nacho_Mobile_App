import {
  CheckoutCompletedEvent,
  useShopifyCheckoutSheet,
} from '@shopify/checkout-sheet-kit';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Signature from 'react-native-signature-canvas';
import Toast from 'react-native-toast-message';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import VectorIcon from '../../Utilities/Component/vectorIcons';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {
  getCart,
  updateAllItemInCartwithWaiverLink,
  updateCartWithCustomer,
  uploadWaverApi,
} from '../../Utilities/Constants/requestHandler';
import STORAGE_KEYS from '../../Utilities/Constants/StorageKeys';
import {downloadFile, getData, removeData} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {moderateScale} from '../../Utilities/Styles/responsiveSize';
import styles from './style';

const WaverForm = ({navigation, route}: any) => {
  const ShopifyCheckout = useShopifyCheckoutSheet();

  const signatureRef = useRef<any>(null);

  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [passportNum, setPassportNum] = useState('');
  const [nationality, setNationlity] = useState('');
  const [parentSignature, setParentSignature] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateType, setDateType] = useState<'dob' | 'expiry' | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const [signature, setSignature] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSignatureIndex, setCurrentSignatureIndex] = useState<
    number | null
  >(null);
  const [modelindex, setModelIndex] = useState(0);
  const [numFields, setNumFields] = useState(1);
  const [loader, setLoader] = useState(false);
  const [signatureData, setSignatureData] = useState<any>([
    {
      id: 1,
      nameLabel: 'Name (Print) *',
      nameValue: name,
      onChangeName: setName,
      signatureLabel: 'Signature',
      signatureValue: signature,
    },
  ]);

  // Handle signature after confirming
  const handleSignature = (signature: string) => {
    if (currentSignatureIndex === -1) {
      setParentSignature(signature);
    } else {
      setSignatureData((prevData: any) =>
        prevData.map((item: any) =>
          item.id === currentSignatureIndex
            ? {...item, signatureValue: signature}
            : item,
        ),
      );
    }
    Toast.show({
      type: 'success',
      text1: 'Signature Captured',
      text2: 'Your signature has been saved successfully.',
    });
    setIsModalVisible(false);
  };

  // Handle Cancel
  const handleCancel = () => {
    Toast.show({
      type: 'info',
      text1: 'Signature Cancelled',
      text2: 'You cancelled the signature process.',
    });
    setIsModalVisible(false);
  };

  const openSignatureModal = (index: number) => {
    setCurrentSignatureIndex(index);
    setModalVisible(false);
    setIsModalVisible(true);
  };

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
    Toast.show({
      type: 'success',
      text1: `${
        dateType === 'dob' ? 'Date of Birth' : 'Passport Expiry'
      } Selected`,
      text2: `You have selected ${formattedDate}.`,
    });

    hideDatePicker();
  };

  const closeModal = () => {
    // Reset all fields if needed
    setSelectedDate('');
    setExpiryDate('');
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setEmail('');
    setPhoneNum('');
    setPassportNum('');
    setNationlity('');
    Toast.show({
      type: 'info',
      text1: 'Form Closed',
      text2: 'You have closed the information form.',
    });

    setModalVisible(false);
  };

  const addNewField = () => {
    // Create new field data
    const newField = {
      id: `${signatureData.length + 1}`,
      nameLabel: 'Name (Print) *',
      nameValue: '',
      onChangeName: txt => {
        const updatedData = [...signatureData];
        updatedData[signatureData.length - 1].nameValue = txt;
        setSignatureData(updatedData);
      },
      signatureLabel: 'Signature',
      signatureValue: '',
    };
    setSignatureData([...signatureData, newField]);
  };

  const removeField = () => {
    if (signatureData.length > 1) {
      setSignatureData(signatureData.slice(0, signatureData.length - 1));
    }
  };

  const handleAddFields = () => {
    setNumFields(numFields + 1);
    addNewField();
  };

  const handleRemoveFields = () => {
    if (numFields > 1) {
      setNumFields(numFields - 1);
      removeField();
    }
  };

  const handleNext = () => {
    // Check if any required fields are empty
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNum ||
      !passportNum ||
      !nationality ||
      !selectedDate || // Add any other required fields here
      !expiryDate
    ) {
      // Show a toast message if any required field is empty
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please complete all required fields before proceeding.',
      });
      return; // Prevent the next step
    }

    // If all fields are filled, proceed to update signature data
    setSignatureData(prevData =>
      prevData.map(item =>
        item.id === modelindex
          ? {
              ...item,
              first_name: firstName,
              middle_name: middleName,
              last_name: lastName,
              dob: selectedDate,
              phone: phoneNum,
              email: email,
              passport_number: passportNum,
              passport_expiry: expiryDate,
              nationality: nationality,
            }
          : item,
      ),
    );

    // Reset the modal fields (optional, if needed)
    // setFirstName('');
    // setMiddleName('');
    // setLastName('');
    // setSelectedDate('');
    // setEmail('');
    // setPhoneNum('');
    // setPassportNum('');
    // setExpiryDate('');
    // setNationlity('');

    setModalVisible(false);
    openSignatureModal(modelindex); // Open the signature modal (or proceed to next step)
  };

  const handleNameChange = (text: string, id: any) => {
    setSignatureData(prevData =>
      prevData.map(item =>
        item.id === id ? {...item, nameValue: text} : item,
      ),
    );
  };

  // Validate all form fields
  const validateForm = () => {
    // Validate parent signature
    if (!parentSignature) {
      Toast.show({
        type: 'error',
        text1: 'Missing Parent Signature',
        text2: 'Please provide your signature at the bottom of the form.',
      });
      return false;
    }

    // Validate each traveler's information
    for (let i = 0; i < signatureData.length; i++) {
      const traveler = signatureData[i];
      const travelerNum = i + 1;

      // Check if name is provided
      if (!traveler.nameValue || traveler.nameValue.trim() === '') {
        Toast.show({
          type: 'error',
          text1: `Missing Information for Traveler ${travelerNum}`,
          text2: 'Please provide the name for all travelers.',
        });
        return false;
      }

      // Check if signature is provided
      if (!traveler.signatureValue) {
        Toast.show({
          type: 'error',
          text1: `Missing Signature for Traveler ${travelerNum}`,
          text2: 'Please provide the signature for all travelers.',
        });
        return false;
      }

      // Check if required personal information is provided
      if (
        !traveler.first_name ||
        !traveler.last_name ||
        !traveler.dob ||
        !traveler.phone ||
        !traveler.email ||
        !traveler.passport_number ||
        !traveler.passport_expiry ||
        !traveler.nationality
      ) {
        Toast.show({
          type: 'error',
          text1: `Incomplete Information for Traveler ${travelerNum}`,
          text2:
            'Please fill in all required personal information for each traveler.',
        });
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(traveler.email)) {
        Toast.show({
          type: 'error',
          text1: `Invalid Email for Traveler ${travelerNum}`,
          text2: 'Please provide a valid email address.',
        });
        return false;
      }

      // Validate phone number (basic validation)
      if (traveler.phone.length < 10) {
        Toast.show({
          type: 'error',
          text1: `Invalid Phone Number for Traveler ${travelerNum}`,
          text2: 'Please provide a valid phone number.',
        });
        return false;
      }
    }

    return true;
  };

  const onSubmitWaver = async () => {
    setLoader(true);

    try {
      // Validate all form fields before submission
      if (!validateForm()) {
        setLoader(false);
        return;
      }

      const userEmail = await getData(STORAGE_KEYS.userEmail);
      const cartList = await getData(STORAGE_KEYS.cartList);
      const customerAccessToken = await getData(STORAGE_KEYS.accessToken);

      const cartID =
        (cartList &&
          cartList.length > 0 &&
          cartList.filter((item: {userEmail: string; cartID: string}) => {
            return item.userEmail.trim() === userEmail?.trim();
          })[0]) ||
        null;

      // Prepare the signature array
      const signatureArray = signatureData.map((data: any) => ({
        name: data.nameValue,
        signature: data.signatureValue,
        first_name: data.first_name,
        middle_name: data.middle_name ?? '',
        last_name: data.last_name,
        dob: data.dob,
        phone: data.phone,
        email: data.email,
        passport_number: data.passport_number,
        passport_expiry: data.passport_expiry,
        nationality: data.nationality,
      }));

      const data = {
        product_date: 'your_product_date_value',
        signature_array: signatureArray,
        parent_signature: parentSignature,
      };

      // Call the upload API
      const waiverRes = await uploadWaverApi(data);
      // If the upload is successful, get cart data and navigate
      if (waiverRes.success) {
        const cartData = await getCart(cartID.cartID);

        if (cartData.cart) {
          const cartLineIDs = cartData?.cart?.lines?.edges?.map(
            (item: any) => item?.node?.id,
          );

          // if (cartLineIDs.length > 0) {
          //   const updateCartItemsWithWaiver =
          //     await updateAllItemInCartwithWaiverLink(
          //       cartID.cartID,
          //       cartLineIDs,
          //       waiverRes.id,
          //     );
          //   if (
          //     updateCartItemsWithWaiver.cartLinesUpdate.userErrors.length === 0
          //   ) {
          //     await downloadPDF(
          //       `https://httpsevolution35app.com/downloadPDF/${waiverRes.id}`,
          //     );

          //     ShopifyCheckout.present(route.params.checkOut);
          //     // navigation.replace(NavigationStrings.WebViewScreen, {
          //     //   checkOutUrl: route.params.checkOut,
          //     // });
          //   }
          // }

          if (cartLineIDs.length > 0) {
            const updateCartItemsWithWaiver =
              await updateAllItemInCartwithWaiverLink(
                cartID.cartID,
                cartLineIDs,
                waiverRes.id,
              );

            if (
              updateCartItemsWithWaiver.cartLinesUpdate.userErrors.length === 0
            ) {
              await downloadPDF(
                `https://httpsevolution35app.com/downloadPDF/${waiverRes.id}`,
              );

              // --- IMPORTANT: ADD THIS STEP ---
              // Update the cart with the customer's identity using the customer access token.
              const updatedCartData = await updateCartWithCustomer(
                cartID.cartID,
                customerAccessToken,
              );

              const checkoutUrl =
                updatedCartData.data.cartBuyerIdentityUpdate.cart.checkoutUrl;

              // Now, present the checkout with the new URL that has the email pre-filled
              ShopifyCheckout.present(checkoutUrl);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      setLoader(false); // Ensure loader is set to false in case of an error
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || error,
      });
    } finally {
      setLoader(false); // Ensure loader is set to false when the process ends, regardless of success/failure
    }
  };

  // Function to Download PDF
  const downloadPDF = async (fileUrl: string) => {
    if (!fileUrl) {
      Toast.show({
        type: 'error',
        text1: 'Download Error',
        text2: 'No PDF URL provided.',
      });
      return;
    }

    const parts = fileUrl.split('/');
    const id = parts[parts.length - 1];

    const filePath = await downloadFile(
      fileUrl,
      `WaiverPDf_${id}.pdf`,
      progress => {},
    );
  };

  useEffect(() => {
    const close = ShopifyCheckout.addEventListener('close', () => {
      // Do something on checkout close
      console.log('CLOSE');
    });

    const completed = ShopifyCheckout.addEventListener(
      'completed',
      async (_event: CheckoutCompletedEvent) => {
        // Lookup order on checkout completion
        // Store or use the orderId if needed in the future
        // const orderId = event.orderDetails.id;
        await removeData(STORAGE_KEYS.cartList);
        await removeData(STORAGE_KEYS.cartItems);
        navigation.goBack();
        console.log('CHECKOUT COMPLETED');
      },
    );

    const error = ShopifyCheckout.addEventListener('error', (error: any) => {
      // Do something on checkout error
      console.log(error.message, 'ERROR');
    });

    return () => {
      // It is important to clear the subscription on unmount to prevent memory leaks
      close?.remove();
      completed?.remove();
      error?.remove();
    };
  }, [ShopifyCheckout]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          position: 'absolute',
          top: 15,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
        <Toast />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, paddingHorizontal: 20, paddingVertical: 10}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Image
              source={ImagePath.backClick}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
          <SizeBox size={10} />
          <View style={styles.formcontainer}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <Text style={{...commonStyles.font16Regular, fontWeight: '600'}}>
                Evolution 35 LLC
              </Text>
              <SizeBox size={2} />
              <Text
                style={{
                  ...commonStyles.font12Regualar2,
                  textAlign: 'right',
                  marginBottom: 5,
                }}>
                Fields marked with <Text style={{color: Colors.red}}>*</Text>{' '}
                are required
              </Text>
              <Text style={{...commonStyles.font16Regular, fontWeight: '600'}}>
                General Release & Indemnity Damage Responsibility
              </Text>
              <SizeBox size={5} />
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                I, the undersigned, and if I am a person under 18 years of age,
                my parents and I (hereafter “I”), desire to participate in the
                Evolution 35 LLC's travel tours (the "Activity"). I understand
                and acknowledge that Evolution 35 LLC, a Utah limited liability
                company (the “Company”), and its related entities have consented
                to my participation in activities expressly subject to my
                execution of this waiver and release (this “Release”) and my
                performance of each of the obligations described in the Release.
              </Text>
              <SizeBox size={3} />
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                I understand that the Company has no control over
                transportation, accommodations and other services and
                specifically release the Company from the same. I understand
                that I am fully responsible for ensuring that I am at the
                transportation pickup locations prior to the departure time. Any
                complaints or issues associated with transportation must be
                addressed directly with the transportation service or
                accommodation provider.
              </Text>
              <SizeBox size={3} />
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                I understand that the Activity involves SIGNIFICANT RISK OF
                PROPERTY DAMAGE, SERIOUS PERSONAL INJURY, OR EVEN DEATH. I
                understand and expressly accept that there are NATURAL,
                MAN-MADE, AND ENVIRONMENTAL CONDITIONS AND RISKS involved in
                being involved in the Activity, including, international travel,
                wars and civil unrest and related detentions, epidemics,
                pandemics and quarantines, food and water borne illnesses,
                falls, changing weather, variations in steepness or terrain,
                natural and man-made obstacles, equipment failure, collisions
                with objects, structures, or other people, animal bites or
                attacks, and reactions, bumps, burns, negligence of others or
                exceeding my own abilities, which may cause severe or even fatal
                injuries. I understand that the Company has no control over
                weather and that activities may need to be cancelled or
                rescheduled. All activities are nonrefundable. I understand that
                the Company may contract with independent parties to provide
                transportation, accommodation, guide services, and or all other
                related travel services. I understand that the Company is in no
                way responsible or liable for such third parties and their
                actions or inactions. I understand that the Company reserves the
                right to make reasonable changes in the itinerary where deemed
                advisable for the comfort and well being of trip members. I
                specifically agree that the Company is not responsible for the
                accommodations during the Activity and any issues that I have
                with the accommodations must be handled directly with the place
                of accommodation.
              </Text>
              <SizeBox size={3} />
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                In consideration of my participation in the Activity, I agree to
                the following terms and conditions:
              </Text>
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                1. I expressly agree to assume all conditions, risks of injury
                and responsibility for all falls, accidents, personal injuries,
                and/or property damage, including all risks of injury or damages
                resulting from any negligence on the part of the Company.
              </Text>
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                2. I agree to forever waive and release the Company from any and
                all claims, damages, rights of action, including any negligence
                on the part of the Company and injuries, losses and damages
                resulting in any way from my participation in the Activity or
                proximity thereto. My release includes all claims regarding
                negligence of the Company, equipment failure, animal problems,
                or any other participant activities, I agree to indemnify and
                hold the Company harmless from all claims, damages or injuries
                related to my participation in the Activity or proximity to the
                Activity, including reimbursement of any attorney’s fees and
                costs incurred by the Company, even if I claim that the Company
                was negligent.
              </Text>
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                3. I agree that no lawsuit will be filed by me or on my behalf
                against the Company as a result of my participation or proximity
                to the Activity or for any injuries or damages that I sustain.
                If I file a lawsuit, I agree to pay any and all attorney fees,
                costs, or judgments incurred by the Company, even if I claim
                that the Company was negligent and shall only file such lawsuit
                in a Utah court. I understand that this is a contract, which
                limits my legal rights and that it is binding upon my heirs and
                my legal representatives, if portions of this agreement are
                invalid, it is agreed that the remaining portions will remain
                enforceable.
              </Text>
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                4. I agree that I am responsible for my own safety and I shall
                accept and abide by the rules and regulations of the Activity. I
                shall follow all instruction and directions from the Company and
                its employees and agree to ask questions to clarify
                misunderstandings of the Company and its employees. I am fully
                responsible for reviewing all of my health restrictions with my
                physician prior to attending the Activity and for receiving any
                and all releases desired from such physician. I further covenant
                that I will abide by all restrictions or limitations recommended
                by my physician and will take full and complete responsibility
                for abiding by the same.
              </Text>
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                5. I irrevocably grant and agree that the Company shall have the
                right to use, air, publish or reproduce photographs, video
                and/or pictures of my name, image and likeness for any lawful
                purpose.
              </Text>
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                6. I UNDERSTAND THAT I AM FINANCIALLY RESPONSIBLE FOR ANY AND
                ALL DAMAGE THAT I MAY CAUSE. I understand that if I damage
                equipment, I will be financially responsible for all costs for
                repair.
              </Text>
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                7. I HAVE READ THIS WAIVER AND RELEASE OF LIABILITY, AND I HAVE
                SIGNED IT VOLUNTARILY.
              </Text>
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                8. I am physically and emotionally able to participate in the
                Activity and assume all responsibility for ensuring my physical
                and emotional needs are met.
              </Text>
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                9. I understand that it is my responsibility to ensure that any
                meals, food or beverages provided to me are in compliance with
                any dietary restrictions that I may have and that it is my
                responsibility to ascertain any information that I need in that
                regard.
              </Text>
              <SizeBox size={5} />
              <FlatList
                data={signatureData}
                keyExtractor={item => item.id.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={[
                      styles.dateContainer,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      },
                    ]}>
                    {/* Name Input */}
                    <View
                      style={[styles.dateInput, {flex: 1, marginRight: 10}]}>
                      <Text style={styles.label}>{item.nameLabel}</Text>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.input}
                          placeholderTextColor="#000"
                          value={item.nameValue}
                          onChangeText={text => handleNameChange(text, item.id)}
                        />
                      </View>
                    </View>

                    {/* Signature Input */}
                    <View style={[styles.dateInput, {flex: 1}]}>
                      <Text style={styles.label}>
                        {item.signatureLabel}{' '}
                        <Text style={{color: Colors.red}}>*</Text>
                      </Text>
                      <View style={styles.inputWrapper}>
                        {item.signatureValue ? (
                          <Image
                            source={{uri: item.signatureValue}}
                            style={styles.signatureImage}
                          />
                        ) : (
                          <TextInput
                            style={[styles.input, {width: '90%'}]}
                            placeholderTextColor="#000"
                            editable={false}
                          />
                        )}
                        <TouchableOpacity
                          onPress={() => {
                            setFirstName(signatureData[index].first_name);
                            setMiddleName(signatureData[index].middle_name);
                            setLastName(signatureData[index].last_name);
                            setSelectedDate(signatureData[index].dob);
                            setEmail(signatureData[index].email);
                            setPhoneNum(signatureData[index].phone);
                            setPassportNum(
                              signatureData[index].passport_number,
                            );
                            setExpiryDate(signatureData[index].passport_expiry);
                            setNationlity(signatureData[index].nationality);
                            setModalVisible(true);
                            setModelIndex(item?.id);
                          }}>
                          <VectorIcon
                            groupName="MaterialCommunityIcons"
                            name="pencil-outline"
                            size={20}
                            color="#000"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
              <SizeBox size={2} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                }}>
                <TouchableOpacity
                  onPress={handleAddFields}
                  style={styles.nextButton}>
                  <Text style={{...commonStyles.font14Center}}>Add Field</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRemoveFields}
                  // onPress={() => console.log(signatureData)}
                  style={[styles.nextButton, {backgroundColor: Colors.red}]}>
                  <Text style={{...commonStyles.font14Center}}>
                    Remove Field
                  </Text>
                </TouchableOpacity>
              </View>
              <SizeBox size={10} />
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                As the parent and/or legal guardian of the above person(s) under
                18, I have read this Release and Agreement. I fully accept the
                terms and conditions of the Release including the full and
                general release, the indemnity and hold harmless of the Company
                and the agreement to never file a lawsuit against the Company. I
                have considered the risks involved and believe the opportunity
                for the person under 18 to participate is worthwhile and useful
                to the person under 18’s development. I have discussed the risks
                with the person under 18 and have determined that we should
                accept those risks and this Agreement. I agree to undertake all
                duties and responsibilities to educate, control and protect the
                pass-holder under 18 from all of the risks involved in the
                Activities. I agree to make all decisions concerning the
                pass-holder under 18’s participation and involvement in the
                Activities.
              </Text>
              <SizeBox size={10} />
              <View style={styles.dateInput}>
                <Text style={styles.label}>
                  Signature of Parent/Legal Guardian:{' '}
                  <Text style={{color: Colors.red}}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  {parentSignature ? (
                    <Image
                      source={{uri: parentSignature}}
                      style={styles.signatureImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <TextInput
                      style={[styles.input, {width: '90%'}]}
                      placeholderTextColor="#000"
                      value={parentSignature ? 'Signature Captured' : ''}
                      editable={false}
                    />
                  )}
                  <TouchableOpacity onPress={() => openSignatureModal(-1)}>
                    <VectorIcon
                      groupName="MaterialCommunityIcons"
                      name="pencil-outline"
                      size={20}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <SizeBox size={10} />
              <Text style={{...commonStyles.font12Bold}}>Note:</Text>
              <SizeBox size={5} />
              <Text
                style={{...commonStyles.font12Regualar2, textAlign: 'justify'}}>
                Please note that local and state taxes, as well as resort fees,
                are not included in the quoted rate and will be payable at
                check-in.
              </Text>
              <SizeBox size={10} />
              <Text style={{...commonStyles.font12Bold}}>
                This waiver form will be in effect for all tours that you book
                with Evolution35.
              </Text>
              <SizeBox size={15} />
            </KeyboardAwareScrollView>
          </View>
          <SizeBox size={10} />
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primaryblue,
              padding: 10,
              height: 48,
              borderRadius: 34,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            // onPress={handleSubmit}
            onPress={onSubmitWaver}>
            <Text style={{...commonStyles.font14Center}}>
              Submit & Book Your Trip
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Signature Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Draw Your Signature</Text>

          {/* Center the Signature Canvas */}
          <View style={styles.signatureContainer}>
            <Signature
              ref={signatureRef}
              onOK={handleSignature}
              onEmpty={() => {
                Toast.show({
                  type: 'error',
                  text1: 'Empty Signature',
                  text2: 'Please draw your signature before confirming.',
                });
              }}
              onClear={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Signature Cleared',
                  text2: 'You cleared the signature canvas.',
                });
              }}
              descriptionText="Sign here"
              webStyle={`
    .m-signature-pad {
      box-shadow: none;
      border: none;
    }
    .m-signature-pad--body {
      border: 1px solid #000;
    }
    .m-signature-pad--footer {
      display: none;
    }
  `}
            />
          </View>

          {/* Modal Footer with Clear, Set, and Cancel Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.setButton}
              onPress={() => signatureRef?.current?.readSignature?.()}>
              <Text style={styles.buttonText}>Set Signature</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.centeredView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                paddingHorizontal: moderateScale(20),
              }}
              keyboardShouldPersistTaps="handled">
              <View style={styles.modalView}>
                <Text style={styles.modalHeadersection}>Add Information</Text>
                <Text
                  style={{
                    ...commonStyles.font12Regualar2,
                    textAlign: 'center',
                    marginBottom: 10,
                  }}>
                  Fields marked with <Text style={{color: Colors.red}}>*</Text>{' '}
                  are required
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={styles.inputfield}
                    placeholder="First Name"
                    placeholderTextColor={Colors.navyblue}
                    value={firstName}
                    onChangeText={txt => setFirstName(txt)}
                  />
                  <Text
                    style={{
                      color: Colors.red,
                      position: 'absolute',
                      right: 10,
                    }}>
                    *
                  </Text>
                </View>
                <TextInput
                  style={styles.inputfield}
                  placeholder="Middle Name"
                  placeholderTextColor={Colors.navyblue}
                  value={middleName}
                  onChangeText={txt => setMiddleName(txt)}
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={styles.inputfield}
                    placeholder="Last Name"
                    placeholderTextColor={Colors.navyblue}
                    value={lastName}
                    onChangeText={txt => setLastName(txt)}
                  />
                  <Text
                    style={{
                      color: Colors.red,
                      position: 'absolute',
                      right: 10,
                    }}>
                    *
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    activeOpacity={0.58}
                    onPress={() => showDatePicker('dob')}
                    style={[
                      styles.inputfielddob,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      },
                    ]}>
                    <Text>
                      {selectedDate
                        ? selectedDate
                        : 'Date of Birth (DD/MM/YYYY)'}
                    </Text>

                    <VectorIcon
                      groupName="Feather"
                      name="calendar"
                      size={20}
                      color={Colors.black}
                      onPress={() => showDatePicker('dob')}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: Colors.red,
                      position: 'absolute',
                      right: 10,
                    }}>
                    *
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={styles.inputfield}
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor={Colors.navyblue}
                    value={email}
                    onChangeText={txt => setEmail(txt)}
                  />
                  <Text
                    style={{
                      color: Colors.red,
                      position: 'absolute',
                      right: 10,
                    }}>
                    *
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={styles.inputfield}
                    placeholder="Phone Number"
                    placeholderTextColor={Colors.navyblue}
                    keyboardType="phone-pad"
                    value={phoneNum}
                    onChangeText={txt => {
                      if (txt.length <= 10) {
                        setPhoneNum(txt);
                      }
                    }}
                  />
                  <Text
                    style={{
                      color: Colors.red,
                      position: 'absolute',
                      right: 10,
                    }}>
                    *
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={styles.inputfield}
                    placeholder="Passport Number"
                    placeholderTextColor={Colors.navyblue}
                    value={passportNum}
                    onChangeText={txt => setPassportNum(txt)}
                  />
                  <Text
                    style={{
                      color: Colors.red,
                      position: 'absolute',
                      right: 10,
                    }}>
                    *
                  </Text>
                </View>

                {/* Passport Expiry Field */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    activeOpacity={0.58}
                    onPress={() => showDatePicker('expiry')}
                    style={[
                      styles.inputfielddob,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      },
                    ]}>
                    <Text>
                      {expiryDate ? expiryDate : 'Passport Expiry (DD/MM/YYYY)'}
                    </Text>

                    <VectorIcon
                      groupName="Feather"
                      name="calendar"
                      size={20}
                      color={Colors.black}
                      onPress={() => showDatePicker('expiry')}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: Colors.red,
                      position: 'absolute',
                      right: 10,
                    }}>
                    *
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={styles.inputfield}
                    placeholder="Nationality"
                    placeholderTextColor={Colors.navyblue}
                    value={nationality}
                    onChangeText={txt => setNationlity(txt)}
                  />
                  <Text
                    style={{
                      color: Colors.red,
                      position: 'absolute',
                      right: 10,
                    }}>
                    *
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={() => {
                    handleNext();
                  }}>
                  <Text style={styles.buttonTxt}>Next</Text>
                </TouchableOpacity>
                <SizeBox size={5} />
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeModal}>
                  <Text style={{...commonStyles.font14Center}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          display="spinner"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </Modal>
    </SafeAreaView>
  );
};
export default WaverForm;
