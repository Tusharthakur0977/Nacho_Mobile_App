import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  ScrollView,
} from 'react-native';
import React from 'react';
import ImagePath from '../../Utilities/Constants/ImagePath';
import commonStyles from '../../Utilities/Styles/commonStyles';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import styles from './style';
import {Colors} from '../../Utilities/Styles/colors';
import {width} from '../../Utilities/Styles/responsiveSize';

const PrivacyPolicy = ({navigation}: any) => {
  const handleFacebookPermissionPress = () => {
    Linking.openURL('https://developers.facebook.com/docs/permissions');
  };
  const handleWvolutionLink = () => {
    Linking.openURL(
      'https://evolution35.com/collections/flight-and-land-packages',
    );
  };
  const handleHere = () => {
    Linking.openURL('https://cloud.google.com/maps-platform/terms');
  };
  const handlePrivacy = () => {
    Linking.openURL('https://policies.google.com/privacy');
  };
  const handleAdds = () => {
    Linking.openURL('https://optout.aboutads.info/?c=2&lang=EN');
  };

  const Section = ({title, children}: any) => (
    <>
      <Text style={styles.welcometxt}>{title}</Text>
      <SizeBox size={10} />
      {children}
      <SizeBox size={15} />
    </>
  );

  const BulletPoint = ({title, content}: any) => (
    <View style={{flexDirection: 'row', marginBottom: 5}}>
      <Text style={styles.policytxt}>•</Text>
      <Text style={[styles.policytxt, {marginLeft: 5}]}>
        <Text
          style={{
            ...commonStyles.font14Bold,
            fontSize: Platform.OS === 'ios' ? 13 : 14,
            fontWeight: 'bold',
          }}>
          {title}:
        </Text>{' '}
        {content}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Header */}
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
          Privacy Policy
        </Text>
      </View>
      <SizeBox size={10} />

      <ScrollView
        contentContainerStyle={{paddingHorizontal: 20}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.datecontainer}>
          {/* Welcome Section */}
          <Text style={{...commonStyles.font20navy}}>
            Welcome to Evolution35{' '}
          </Text>
          <SizeBox size={5} />
          <Text style={styles.policytxt}>
            Thank you for being a valued part of the Evolution35 community. We
            are dedicated to safeguarding your personal information and
            respecting your privacy. If you have any questions or concerns about
            our policy or our practices regarding your personal data, please
            don't hesitate to reach out to us at info@evolution35.com.
          </Text>
          <SizeBox size={5} />
          <Text style={styles.policytxt}>
            By visiting our website at{' '}
            <Text
              style={{...commonStyles.font12Bold, color: Colors.primaryblue}}
              onPress={handleWvolutionLink}>
              https://evolution35.com
            </Text>{' '}
            and using our services, you trust us with your personal information.
            We take this responsibility seriously. This privacy notice outlines
            our privacy policy and aims to provide you with clear information
            about what data we collect, how we use it, and the rights you have
            in relation to it. We encourage you to read this notice carefully,
            as it is important for your understanding. If you disagree with any
            of the terms outlined, please refrain from using our site and
            services.
          </Text>
          <SizeBox size={5} />
          <Text style={styles.policytxt}>
            This privacy policy applies to all information collected through our
            websites (such as{' '}
            <Text
              style={{...commonStyles.font12Bold, color: Colors.primaryblue}}
              onPress={handleWvolutionLink}>
              https://evolution35.com
            </Text>{' '}
            and our Facebook applications (“Apps”)), as well as any related
            services, sales, marketing, or events (collectively referred to as
            the “Sites”).
          </Text>
          <SizeBox size={5} />
          <Text style={styles.policytxt}>
            Please review this privacy policy carefully so you can make informed
            decisions about sharing your personal information with us.
          </Text>
          <SizeBox size={5} />
          {/* Information We Collect */}
          <Section title="Information We Collect">
            <Text style={styles.policytxt}>
              We collect personal information that you provide to us, including
              your name, address, contact details, account credentials, payment
              information, and social media login data.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              When you interact with our Sites or Apps—whether by registering,
              expressing interest in our products or services, participating in
              activities (such as posting in online forums or entering
              contests), or reaching out to us directly—we collect the personal
              information you voluntarily provide.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              The personal information we collect depends on the nature of your
              interactions with us, the choices you make, and the features or
              services you use. This may include the following types of
              information :
            </Text>
            <SizeBox size={5} />

            <BulletPoint
              title="Name and Contact Information "
              content="We collect your first and last name, email address, postal address, phone number, and other similar contact details, including passport information."
            />
            <BulletPoint
              title="Account Credentials "
              content=" We collect passwords, password hints, and other security information required for account authentication and access."
            />
            <BulletPoint
              title="Payment Information "
              content="If you make a purchase, we collect data needed to process your payment, such as your payment method (e.g., credit card number) and the security code associated with it. Please note that all payment information is stored by our payment processor, and we encourage you to review their privacy policies for further details."
            />
            <BulletPoint
              title="Social Media Login Information"
              content=" We offer the option to register or log in using your social media account details (e.g., Facebook, Twitter). If you choose this method, we will collect the information outlined in the Social Logins section below."
            />
            <Text style={styles.policytxt}>
              It is important that all personal information you provide to us is
              accurate, complete, and up-to-date. You are responsible for
              notifying us of any changes to your personal information.
            </Text>
          </Section>

          {/* Automatically Collected */}
          <Section title="Information Automatically Collected :">
            <Text style={styles.policytxt}>
              We automatically collect certain information, such as your IP
              address, browser, and device details, when you visit our websites.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              When you visit, use, or navigate our Sites, we automatically
              gather certain types of information. While this information
              doesn't directly identify you (such as your name or contact
              details), it may include technical data such as your IP address,
              browser type, device characteristics, operating system, language
              preferences, referring URLs, device name, location, and details
              about how and when you interact with our Sites. This data is
              essential for ensuring the security and functionality of our Sites
              and is also used for internal analytics and reporting purposes.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              Additionally, like many websites, we use cookies and similar
              technologies to collect information. For more details, please
              refer to our Cookies Policy.
            </Text>
          </Section>

          {/* App Data */}
          <Section title="Information Collected Through Our Apps :">
            <Text style={styles.policytxt}>
              When you use our Apps, we may collect information related to your
              geo-location, mobile device, push notifications, and Facebook
              permissions.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              If you use our Apps, we may collect the following types of
              information :
            </Text>
            <SizeBox size={5} />
            <BulletPoint
              title="Geo-Location Information"
              content="We may request access to your device’s location to provide location-based services. This information may be tracked continuously or while you are using the app. You can adjust location permissions in your device settings at any time."
            />
            <BulletPoint
              title="Mobile Device Access"
              content="We may request access to specific features on your mobile device, including Bluetooth, calendar, camera, contacts, microphone, reminders, sensors, SMS messages, social media accounts, and storage. You can manage these permissions through your device’s settings."
            />
            <BulletPoint
              title="Mobile Device Data"
              content="We may automatically collect certain details about your device, such as its ID, model, manufacturer, operating system, version, and IP address."
            />
            <BulletPoint
              title="Push Notifications"
              content="We may send push notifications related to your account or app updates. If you prefer not to receive these notifications, you can disable them in your device’s settings."
            />
            <BulletPoint
              title="Facebook Permissions"
              content={
                <>
                  By default, we access basic information from your Facebook
                  account, including your name, email, gender, birthday, current
                  city, and profile picture URL. We may also request additional
                  permissions, such as access to your friends list, check-ins,
                  and likes. You can choose to grant or deny access to each
                  individual permission. For more details on Facebook
                  permissions, please refer to the{' '}
                  <Text
                    style={{color: Colors.primaryblue}}
                    onPress={handleFacebookPermissionPress}>
                    Facebook Permissions Reference page
                  </Text>
                  .
                </>
              }
            />
          </Section>

          {/* Third-Party Sources */}
          <Section title="Information Collected From Other Sources :">
            <Text style={styles.policytxt}>
              We may collect limited information from public databases,
              marketing partners, social media platforms, and other external
              sources.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              We may obtain information about you from third-party sources,
              including public databases, joint marketing partners, social media
              platforms (such as Facebook), and other external providers.
              Examples of the information we may receive include your social
              media profile details (such as name, gender, birthday, email,
              current city, state, country, user ID numbers for contacts,
              profile picture URL, and any other information you choose to share
              publicly), as well as marketing leads, search results, and links
              (including paid listings like sponsored links).
            </Text>
          </Section>

          {/* How We Use Information */}
          <Section title="How We Use Your Information :">
            <Text style={styles.policytxt}>
              We process your information for various purposes based on
              legitimate business interests, fulfillment of our contract with
              you, compliance with legal obligations, and/or your consent.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              We use the personal information collected through our Sites for a
              range of business purposes. We rely on several legal grounds to
              process your information, including our legitimate business
              interests ("Business Purposes"), the need to perform a contract
              with you ("Contractual"), your consent ("Consent"), and compliance
              with legal obligations ("Legal Reasons"). Below, we outline the
              specific purposes for which we process your information, along
              with the grounds for each.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              We use the information we collect or receive for the following
              purposes :
            </Text>
            <SizeBox size={5} />
            <BulletPoint
              title="Account Creation and Logon [with your Consent] "
              content="If you choose to link your account to a third-party account (e.g., Google or Facebook), we use the information you allow us to collect from these third parties to facilitate the account creation and login process. See the Social Logins section for more details."
            />
            <BulletPoint
              title="Marketing and Promotional Communications [for Business Purposes and/or with your Consent] "
              content="We and/or our third-party marketing partners may use your personal information to send marketing communications, in accordance with your preferences. You can opt out of marketing emails at any time (see Your Privacy Rights below)."
            />
            <BulletPoint
              title="Administrative Information [for Business Purposes, Legal Reasons, and/or Contractual] "
              content="We may use your information to send you updates about our products, services, features, and any changes to our terms, conditions, or policies."
            />
            <BulletPoint
              title="Order Fulfillment and Management [for Contractual reasons] "
              content="We use your information to process and manage your orders, payments, returns, and exchanges through our Sites."
            />
            <BulletPoint
              title="Testimonials [with your Consent] "
              content="We may post testimonials on our Sites that contain personal information. Before posting, we will seek your consent to use your name and testimonial. If you wish to update or remove your testimonial, please contact us at info@Evolution35.com, including your name, testimonial location, and contact details."
            />
            <BulletPoint
              title="Targeted Advertising [for Business Purposes and/or with your Consent] "
              content="We may use your information to develop personalized content and advertisements tailored to your interests or location. This may include working with third parties to deliver targeted advertising. For more information, refer to our Cookie Policy."
            />
            <BulletPoint
              title="Prize Draws and Competitions [for Business Purposes and/or with your Consent] "
              content="If you choose to participate in prize draws or competitions, we may use your information to administer these activities."
            />
            <BulletPoint
              title="Feedback Requests [for Business Purposes and/or with your Consent] "
              content="Feedback Requests [for Business Purposes and/or with your Consent]"
            />
            <BulletPoint
              title="Site Security [for Business Purposes and/or Legal Reasons] "
              content="We may use your information to ensure the safety and security of our Sites, including for fraud detection and prevention."
            />
            <BulletPoint
              title="User-to-User Communications [with your Consent] "
              content="We may use your information to facilitate communication between users, with each user's consent."
            />
            <BulletPoint
              title="Enforcement of Terms, Conditions, and Policies [for Business Purposes, Legal Reasons, and/or Contractual] "
              content="We may use your information to enforce our terms, conditions, and policies."
            />
            <BulletPoint
              title="Legal Requests and Harm Prevention [for Legal Reasons] "
              content="If we receive a subpoena or other legal requests, we may review the data we hold to determine how to respond."
            />
            <BulletPoint
              title="Other Business Purposes "
              content=" We may use your information for additional business purposes, such as data analysis, identifying usage trends, assessing the effectiveness of our promotional campaigns, and improving our Sites, products, services, and overall user experience."
            />
          </Section>

          {/* Information Sharing */}
          <Section title="Information Sharing :">
            <Text style={styles.policytxt}>
              We only share your information with your consent, to comply with
              legal requirements, to protect your rights, or to fulfill business
              obligations.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              We share and disclose your information only in the following
              situations:
            </Text>
            <SizeBox size={5} />
            <BulletPoint
              title="Compliance with Laws "
              content="We may disclose your information when required by law, such as in response to governmental requests, judicial proceedings, court orders, or legal processes (e.g., subpoenas or public authorities requests related to national security or law enforcement)."
            />
            <BulletPoint
              title="Vital Interests and Legal Rights "
              content="We may disclose your information if we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, threats to safety, illegal activities, or as evidence in litigation in which we are involved."
            />
            <BulletPoint
              title="Vendors, Consultants, and Third-Party Service Providers "
              content="We may share your data with third-party vendors, service providers, contractors, or agents who perform services on our behalf. These services may include payment processing, data analysis, email delivery, hosting, customer service, and marketing. Some third parties may use tracking technologies on our Sites to collect data about your interactions over time, helping us analyze online activity and improve the user experience. We do not share, sell, rent, or trade your information with third parties for their promotional purposes, unless stated in this policy."
            />
            <BulletPoint
              title="Business Transfers "
              content="We may share or transfer your information in connection with or during negotiations of a merger, sale of company assets, financing, or acquisition of all or part of our business by another company."
            />
            <BulletPoint
              title="Third-Party Advertisers "
              content="We may work with third-party advertising companies to serve ads on our Sites. These companies may use cookies and other tracking technologies to collect information about your visits to our Sites and other websites, enabling them to deliver relevant advertisements to you. For more details, refer to our Cookie Policy."
            />
            <BulletPoint
              title="Affiliates "
              content="We may share your information with our affiliates, including our parent company, subsidiaries, joint venture partners, or other companies under common control with us. We require these affiliates to comply with this privacy policy."
            />
            <BulletPoint
              title="Business Partners "
              content="We may share your information with trusted business partners to offer products, services, or promotions."
            />
            <BulletPoint
              title="With Your Consent "
              content="We may disclose your personal information for other purposes with your explicit consent."
            />
            <BulletPoint
              title="Other Users "
              content="When you share personal information by posting comments, contributions, or content to public areas of the Sites (or App), that information may be visible to all users and could be publicly distributed outside the Sites (or App) indefinitely. If you interact with other users via a social network (e.g., Facebook), your contacts on that network may see your name, profile photo, and activity details. Other users may also view your profile and activity descriptions, and communicate with you within the Sites."
            />
            <BulletPoint
              title="Offer Wall "
              content="Our Apps may feature a third-party-hosted offer wall, where third-party advertisers provide virtual currency, gifts, or other incentives in exchange for completing specific offers. When you interact with the offer wall, you will leave our mobile application, and your user ID may be shared with the provider to prevent fraud and properly credit your account."
            />
          </Section>

          {/* Cookies and Tracking Technologies */}
          <Section title="Cookies and Tracking Technologies :">
            <Text style={styles.policytxt}>
              We use cookies and other tracking technologies, such as web
              beacons and pixels, to collect and store your information.
              Detailed information about how we utilize these technologies and
              how you can refuse certain cookies is provided in our Cookie
              Policy.
            </Text>
          </Section>

          {/* Google Maps */}
          <Section title="Google Maps :">
            <Text style={styles.policytxt}>
              We use Google Maps to enhance our services.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              This website, mobile application, or Facebook application
              integrates Google Maps APIs. By using these services, you agree to
              Google’s Terms of Service, which can be reviewed{' '}
              <Text
                style={{...commonStyles.font12Bold, color: Colors.primaryblue}}
                onPress={handleHere}>
                here
              </Text>
              . To better understand how Google handles your data, please refer
              to their{' '}
              <Text
                style={{...commonStyles.font12Bold, color: Colors.primaryblue}}
                onPress={handlePrivacy}>
                Privacy Policy
              </Text>
              .
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              By using our Google Maps API integration, you consent to the
              collection of both personally identifiable information (such as
              usernames) and non-personally identifiable information (such as
              location data). For further details on how we use and disclose
              your information, please refer to the sections titled “Use of Your
              Information” and “Disclosure of Your Information.”
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              You also consent to our ability to access or store your location,
              which may be used alongside data from other providers. You may
              revoke this consent at any time. Additionally, the Maps APIs we
              use may store cookies and other information on your device.
            </Text>
          </Section>

          {/* How We Handle Your Social Logins */}
          <Section title="How We Handle Your Social Logins :">
            <Text style={styles.policytxt}>
              If you choose to register or log in to our website using a social
              media account, we may have access to certain information about
              you.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              Our Sites provide the option to register and log in using your
              third-party social media account credentials (such as Facebook or
              Twitter). By choosing this method, we may receive specific profile
              information from your social media provider. The information
              shared will vary depending on the provider but may include your
              name, email address, friends list, profile picture, and other
              details you’ve made public. If you log in via Facebook, for
              example, we may also request access to additional permissions,
              such as your friends list, check-ins, and likes. You can choose to
              grant or deny access to each individual permission.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              We will use the information received solely for the purposes
              described in this privacy policy or as otherwise made clear to you
              on the Sites. Please be aware that we do not control and are not
              responsible for any other use of your personal information by the
              third-party social media provider. We encourage you to review
              their privacy policy to better understand how they collect, use,
              and share your personal information, as well as how you can manage
              your privacy settings on their platforms.
            </Text>
          </Section>
          {/* Is Your Information Transferred Internationally */}
          <Section title="Is Your Information Transferred Internationally ? ">
            <Text style={styles.policytxt}>
              We may transfer, store, and process your information in countries
              outside your own.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              Our servers are located in the USA and potentially in Spain. If
              you access our Sites from outside your country, please be aware
              that your information may be transferred to, stored, and processed
              by us in these locations, as well as by third parties with whom we
              may share your personal information (see "Disclosure of Your
              Information" above).
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              If you are a resident of the European Economic Area (EEA), please
              note that the countries where your information is processed may
              not have data protection laws as comprehensive as those in your
              country. However, we will take all necessary steps to protect your
              personal information in line with this privacy policy and
              applicable laws.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              To ensure your personal information is protected, we may implement
              the European Commission's Standard Contractual Clauses for
              transfers of personal data between our group companies and
              third-party service providers. These clauses require recipients of
              personal information to handle it in compliance with European data
              protection laws. Similar safeguards are also in place with our
              third-party partners, and we can provide further details upon
              request.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              Alternatively, if we transfer your information from the European
              Union to the United States, we comply with the EU-U.S. Privacy
              Shield Framework, as established by the U.S. Department of
              Commerce. Evolution35 has certified its adherence to the Privacy
              Shield principles regarding the collection, use, and retention of
              personal data. As such, we are committed to ensuring that all
              personal data received from EU countries is handled in accordance
              with the Privacy Shield Framework.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              Evolution35 is responsible for the processing of personal
              information received under the Privacy Shield Framework and any
              subsequent transfer to a third-party agent acting on our behalf.
              We are subject to the regulatory enforcement powers of the U.S.
              Federal Trade Commission (FTC). In certain circumstances, we may
              be required to disclose personal information in response to lawful
              requests by public authorities, including to meet national
              security or law enforcement obligations.
            </Text>
          </Section>

          {/* Our Stance on Third Party Websites */}
          <Section title="Our Stance on Third Party Websites :">
            <Text style={styles.policytxt}>
              We are not responsible for the security of any information you
              share with third-party advertisers who are not affiliated with our
              websites.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              Our Sites may feature advertisements from third parties that are
              not affiliated with us, and these ads may link to external
              websites, services, or mobile applications. We cannot guarantee
              the security or privacy of any data you provide to these third
              parties. Any information collected by third parties is not
              governed by this privacy policy. We are not responsible for the
              content, privacy practices, or security policies of any third
              parties, including those of external websites, services, or
              applications linked to or from our Sites. We encourage you to
              review the privacy policies of such third parties and contact them
              directly if you have any questions.
            </Text>
          </Section>
          {/*How Long Do We Keep Your Information*/}
          <Section title="How Long Do We Keep Your Information ?">
            <Text style={styles.policytxt}>
              We retain your information only as long as necessary to fulfill
              the purposes outlined in this privacy policy, unless a longer
              retention period is required by law.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              Your personal information will be kept only for as long as needed
              to achieve the purposes described in this privacy policy, unless a
              longer retention period is mandated or allowed by law (such as for
              tax, accounting, or other legal obligations). No retention period
              outlined in this policy will exceed [90 days/6 months/1 year/2
              years/the duration of your account with us/90 days after your
              account is terminated/6 months after your account is terminated/1
              year after your account is terminated/2 years after your account
              is terminated].
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              When we no longer have a legitimate business need to process your
              personal information, we will either delete or anonymize it. If
              deletion or anonymization is not possible (for example, if your
              data is stored in backup archives), we will securely store your
              personal information and prevent further processing until it can
              be safely deleted.
            </Text>
          </Section>
          {/* Security */}
          <Section title="Security :">
            <Text style={styles.policytxt}>
              We are committed to safeguarding your personal information through
              a combination of organizational and technical security measures.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              We have put in place appropriate technical and organizational
              safeguards to help protect the security of your personal
              information. However, it’s important to note that no method of
              transmitting data over the internet is completely secure. While we
              strive to protect your personal information, the transmission of
              data to and from our Sites is done at your own risk. We recommend
              that you access our services only from a secure environment to
              help ensure the safety of your information.
            </Text>
          </Section>
          {/* Children's Privacy */}
          <Section title="Children's Privacy :">
            <Text style={styles.policytxt}>
              We do not knowingly collect or market data to children under the
              age of 18.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              We do not knowingly collect personal information from or market to
              individuals under the age of 18. By using our Sites, you confirm
              that you are at least 18 years old, or that you are the parent or
              guardian of a minor who is using the Site [and App], and you
              consent to their use of our services. If we become aware that we
              have inadvertently collected personal information from users under
              the age of 18, we will take immediate steps to deactivate the
              account and delete the data. If you believe we have collected data
              from a child under 18, please contact us at info@evolution35.com.
            </Text>
          </Section>
          {/* Your Choices */}
          <Section title="Your Choices :">
            <Text style={styles.policytxt}>
              You can access, update, or delete your account information. You
              may also opt-out of marketing communications. Keep in mind that
              certain services may be unavailable if you choose not to provide
              certain information.
            </Text>
          </Section>
          {/* Updates to Privacy Policy */}
          <Section title="Updates to Privacy Policy :">
            <Text style={styles.policytxt}>
              Yes, we will update this policy as needed to remain compliant with
              applicable laws.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              We may update this privacy policy periodically. The most recent
              version will be indicated by the "Revised" date, and the updated
              policy will take effect once it is posted. If we make significant
              changes, we may notify you by posting a prominent notice on the
              Sites or sending you a direct notification. We encourage you to
              review this privacy policy regularly to stay informed about how we
              are safeguarding your information.
            </Text>
          </Section>
          {/* Your Privacy Rights */}
          <Section title="Your Privacy Rights :">
            <Text style={styles.policytxt}>
              In some regions, such as the European Economic Area, you have
              specific rights that provide you with greater access to and
              control over your personal information. You may review, update, or
              delete your account at any time.
            </Text>
            <Text style={styles.policytxt}>
              Under applicable data protection laws (such as those in the
              European Economic Area), you may have the right to :
            </Text>
            <Text style={styles.policytxt}>
              (i) request access to and receive a copy of your personal
              information;
            </Text>
            <Text style={styles.policytxt}>
              (ii) request correction or deletion of your personal information;
            </Text>
            <Text style={styles.policytxt}>
              (iii) restrict the processing of your personal information; and
            </Text>
            <Text style={styles.policytxt}>
              (iv) where applicable, request data portability.
            </Text>
            <Text style={styles.policytxt}>
              In some cases, you may also have the right to object to the
              processing of your personal information. To exercise these rights,
              please use the contact details provided below. We will evaluate
              and respond to your request in accordance with applicable laws.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              If we process your personal information based on your consent, you
              have the right to withdraw that consent at any time. However,
              please note that this will not affect the lawfulness of the
              processing carried out before you withdrew your consent.
            </Text>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              If you are a resident of the European Economic Area and believe we
              are processing your personal information unlawfully, you have the
              right to file a complaint with your local data protection
              supervisory authority. You can find their contact details here.
            </Text>
          </Section>
          {/* Account Information */}
          <Section title="Account Information :">
            <Text style={styles.policytxt}>
              You have the ability to review, update, or change the information
              in your account, or terminate your account at any time by:
            </Text>
            <SizeBox size={5} />

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.policytxt}>•</Text>
              <Text style={[styles.policytxt, {marginLeft: 5}]}>
                Logging into your account settings to update your details.
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.policytxt}>•</Text>

              <Text style={[styles.policytxt, {marginLeft: 5}]}>
                Contacting us directly using the contact information provided
                below.
              </Text>
            </View>
            <SizeBox size={5} />
            <Text style={styles.policytxt}>
              If you request to terminate your account, we will deactivate or
              delete your account and information from our active databases.
              However, certain information may be retained in our records to
              prevent fraud, address issues, assist with investigations, enforce
              our Terms of Use, and/or comply with legal obligations.
            </Text>
            <SizeBox size={5} />
            <Text style={[styles.policytxt, {fontWeight: 'bold'}]}>
              Cookies and Similar Technologies:
            </Text>
            <Text style={styles.policytxt}>
              Most web browsers are set to accept cookies by default. If you
              prefer, you can usually adjust your browser settings to remove or
              reject cookies. Please note that doing so may impact the
              functionality of certain features or services on our Sites. To
              opt-out of interest-based advertising by advertisers on our Site,
              please visit{' '}
              <Text
                style={{
                  ...commonStyles.font12Bold,
                  color: Colors.primaryblue,
                  textDecorationLine: 'underline',
                }}
                onPress={handleAdds}>
                http://www.aboutads.info/choices/
              </Text>
              . For more information, refer to our Cookie Policy.
            </Text>
            <SizeBox size={5} />
            <Text style={[styles.policytxt, {fontWeight: 'bold'}]}>
              Opting Out of Email Marketing:
            </Text>
            <Text style={styles.policytxt}>
              You can unsubscribe from our marketing emails at any time by
              clicking the unsubscribe link in the emails we send or by
              contacting us directly using the contact information below. Once
              unsubscribed, you will no longer receive marketing emails, but you
              may still receive service-related emails necessary for the
              administration of your account. You can also opt-out by:
            </Text>
            <SizeBox size={5} />
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.policytxt}>•</Text>
              <Text style={[styles.policytxt, {marginLeft: 5}]}>
                Indicating your preferences during the registration process.
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.policytxt}>•</Text>
              <Text style={[styles.policytxt, {marginLeft: 5}]}>
                Logging into your account settings to update your preferences.
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.policytxt}>•</Text>
              <Text style={[styles.policytxt, {marginLeft: 5}]}>
                Contacting us directly using the contact information provided
                below.
              </Text>
            </View>
          </Section>
          {/* Contact Us */}
          <Section title="Contact Us :">
            <Text style={styles.policytxt}>
              For questions or concerns about this Privacy Policy, please
              contact us at info@evolution35.com. This Privacy Policy applies to
              Evolution 35 services and should be read in conjunction with our
              Terms of Use.
            </Text>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
