# Nacho Travel App 🌍✈️

A premium, React Native mobile application designed for booking immersive travel tours, planning custom itineraries, and seamlessly processing transactions through a headless Shopify architecture.

### 📱 Download the App
- [Download on the App Store (iOS)](https://apps.apple.com/in/app/evolution35/id6740553296)

## 💡 Why This Project Stands Out

Building Nacho was an exercise in bridging the gap between a content-rich travel application and a robust, secure e-commerce platform. The primary engineering challenge was integrating a headless Shopify architecture into a React Native environment while enforcing complex pre-checkout requirements (such as multi-user legal waivers). 

Managing the intricate asynchronous flow—from capturing multiple base64 digital signatures, uploading them to generate legal PDFs, executing complex GraphQL mutations to link these waivers to specific cart items, and finally presenting a frictionless native Shopify checkout sheet—demonstrates a deep understanding of React Native bridge integrations, advanced state management, and API orchestration. The resulting architecture is both highly scalable and exceptionally user-friendly, completely abstracting the complex backend processes away from the traveler.

## ⭐ Spotlight Feature: Dynamic Digital Waivers & Headless Shopify Checkout

The most technically complex feature in the application is the **Digital Waiver & Multi-Traveler Signature Flow** (`WaverForm/index.tsx`). 

### The Challenge
Before completing a high-risk or international travel booking, users must sign a legally binding liability waiver. However, bookings often involve multiple travelers (e.g., families or groups). The application needed to dynamically generate form fields, capture individual digital signatures for each traveler on the fly, and map all this data seamlessly into a Shopify headless checkout process—all without breaking the user experience.

### Under the Hood
1. **Dynamic State Management**: Maintains a scalable array of traveler objects (`signatureData`) where users can add or remove travelers dynamically. It relies on complex React state updates to ensure each traveler's input fields and signature canvas remain decoupled and performant.
2. **Canvas Signature Capture**: Utilizes `react-native-signature-canvas` within controlled modals to capture base64 representations of signatures for each individual traveler and the parent/guardian.
3. **Complex Validation & API Orchestration**: Validates all dynamically generated fields (passports, DOBs, emails, signatures). On submission, it sends the payload to an external API to generate a legal PDF, retrieves the PDF ID, and uses GraphQL to mutate the Shopify Cart lines, attaching the waiver directly to the specific booking.
4. **Seamless Headless Checkout**: Once the waiver is mapped to the cart, the system updates the Shopify Cart Buyer Identity and immediately triggers `@shopify/checkout-sheet-kit` for a native, frictionless payment experience without the user ever leaving the app.

## 🚀 Tech Stack

- **Framework**: React Native (v0.76.5) with TypeScript
- **State Management**: Redux Toolkit & React-Redux
- **Navigation**: React Navigation v7 (Native Stack & Bottom Tabs)
- **Data Fetching / API**: Apollo Client (for Shopify Storefront GraphQL integration) & Axios
- **E-Commerce / Checkout**: Shopify Checkout Sheet Kit (`@shopify/checkout-sheet-kit`)
- **Maps & Routing**: React Native Maps & Maps Directions
- **Animations & Gestures**: React Native Reanimated v3, React Native Gesture Handler
- **Core Libraries**: `react-native-calendars`, `react-native-signature-canvas`, `react-native-reanimated-carousel`, `react-native-step-indicator`

## 🛠 Key Features

- **Custom Trip Planning**: Interactive multi-step wizard allowing users to curate daily itineraries, select activities, and pick dates using interactive calendars.
- **E-commerce & Cart Management**: Robust cart system supporting travel packages and dynamic bookings, fully powered by Redux and a headless Shopify backend.
- **Interactive Maps Integration**: Visualize travel routes, tour locations, and directions right within the app for an enhanced exploration experience.
- **Rich Media & Content**: Seamless video playback with YouTube iframe integration and high-performance image rendering using fast-image caching.
- **User Authentication & Profiles**: Secure login and OTP verification flows, along with comprehensive profile management and booking history.
