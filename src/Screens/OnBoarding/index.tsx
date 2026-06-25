import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import ImagePath from '../../Utilities/Constants/ImagePath';
import NavigationStrings from '../../Utilities/Constants/NavigationStrings';
import STORAGE_KEYS from '../../Utilities/Constants/StorageKeys';
import {storeData} from '../../Utilities/Helpers';
import {Colors} from '../../Utilities/Styles/colors';
import styles from './style';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const OnBoarding = ({navigation}: any) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    ImagePath.Onboarding,
    ImagePath.Onboardingone,
    ImagePath.Onboardingtwo,
  ];

  // Static slide data (Using your image list for structure)
  const slides = [
    {
      title: 'Get the Best Deal',
      description:
        'We provide a range of exclusive promotions and discounts to make your trip more affordable.',
      image: ImagePath.Onboarding,
    },
    {
      title: 'Easy Booking',
      description:
        'Book your trips effortlessly with our intuitive and user-friendly interface in just a few taps.',
      image: ImagePath.Onboardingone,
    },
    {
      title: 'Travel Smart',
      description:
        'Access real-time updates and essential travel tips right from your pocket for a smooth journey.',
      image: ImagePath.Onboardingtwo,
    },
  ];

  const handleSkip = async () => {
    await storeData(STORAGE_KEYS.isOnBoarded, true);
    navigation.push(NavigationStrings.TabRoutes);
  };

  const handleNext = async () => {
    if (activeIndex < slides.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      swiperRef.current.scrollTo({
        x: newIndex * screenWidth,
        animated: true,
      });
    } else {
      await storeData(STORAGE_KEYS.isOnBoarded, true);
      navigation.push(NavigationStrings.TabRoutes);
    }
  };

  const nextButtonScale = useRef(new Animated.Value(1)).current;

  const animateNextButton = () => {
    Animated.sequence([
      Animated.timing(nextButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(nextButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleNext();
    });
  };

  // ❌ REMOVED: The background color interpolation is removed as it was set to white
  // 💡 FIX: Use a static background color for the main view that blends better
  const mainBackgroundColor = Colors.black; // Using black to hide the white flash

  return (
    <Animated.View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
      {/* 1. SCROLL VIEW (For Images/Text) */}
      <Animated.ScrollView
        ref={swiperRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={true}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
          },
        )}
        onMomentumScrollEnd={e => {
          const contentOffsetX = e.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffsetX / screenWidth);
          setActiveIndex(index);
        }}>
        {slides.map((slide, index) => {
          const inputRange = [
            (index - 1) * screenWidth,
            index * screenWidth,
            (index + 1) * screenWidth,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={{
                width: screenWidth,
                transform: [{scale}],
                opacity,
                height: screenHeight,
              }}>
              <ImageBackground
                source={slide.image}
                style={{
                  width: screenWidth,
                  height: screenHeight,
                  justifyContent: 'flex-end',
                }}
                resizeMode="cover">
                <View style={styles.textContainer}>
                  <Text style={styles.dealtxt}>{slide.title}</Text>
                  <SizeBox size={5} />
                  <Text style={styles.dealdesctxt}>{slide.description}</Text>
                </View>
                {/* Placeholder space for controls now moved to fixedControlsContainer */}
                <SizeBox size={100} />
              </ImageBackground>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.fixedControlsContainer}>
        {/* Indicator */}
        <View
          style={{
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          {slides.map((_, indicatorIndex) => (
            <View
              key={indicatorIndex}
              style={{
                height: 3,
                width: 12,
                backgroundColor:
                  indicatorIndex === activeIndex
                    ? Colors.white
                    : Colors.skipgrey,
                marginHorizontal: 3,
                borderRadius: 17,
              }}
            />
          ))}
        </View>
        <SizeBox size={10} />
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.skipbtn}
            onPress={handleSkip}
            activeOpacity={0.7}>
            <Text style={styles.buttontxt}>Skip</Text>
          </TouchableOpacity>

          <Animated.View style={{transform: [{scale: nextButtonScale}]}}>
            <TouchableOpacity
              style={styles.Nextbtn}
              onPress={animateNextButton}
              activeOpacity={0.7}>
              <Text style={styles.buttontxt}>
                {activeIndex === slides.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <SizeBox size={30} />
      </View>
    </Animated.View>
  );
};

export default OnBoarding;
