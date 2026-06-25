import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import styles from './styles';
import ImagePath from '../../Utilities/Constants/ImagePath';
import {height} from '../../Utilities/Styles/responsiveSize';
import VectorIcon from '../../Utilities/Component/vectorIcons';
import {Colors} from '../../Utilities/Styles/colors';
import {SizeBox} from '../../Utilities/Component/hooks/Helpers';
import commonStyles from '../../Utilities/Styles/commonStyles';

const DATA = [
  {id: '1', title: 'Paris Travel Tour 292', duration: '4 days/ 3 nights'},
  {id: '2', title: 'Rome Adventure 101', duration: '3 days/ 2 nights'},
  {id: '3', title: 'London Explorer 123', duration: '5 days/ 4 nights'},
  {id: '4', title: 'London Explorer 123', duration: '5 days/ 4 nights'},
  {id: '5', title: 'London Explorer 123', duration: '5 days/ 4 nights'},
  {id: '6', title: 'London Explorer 123', duration: '5 days/ 4 nights'},
];

const Wishlist = ({navigation}: any) => {
  const renderTourList = ({item}) => (
    <TouchableOpacity
      style={styles.outerview}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PackageDetail')}>
      <ImageBackground
        source={ImagePath.Girl}
        style={{
          height: height / 4,
          width: '100%',
        }}
        borderRadius={5}>
        <View style={styles.tabcontainer}>
          <VectorIcon
            groupName="AntDesign"
            name="heart"
            size={16}
            color={Colors.primaryblue}
          />
        </View>
      </ImageBackground>
      <SizeBox size={5} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text style={styles.traveltxt}>{item.title}</Text>
          <Text style={styles.daytxt}>{item.duration}</Text>
        </View>
        <TouchableOpacity
          style={styles.arrowcon}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('PackageDetail')}>
          <VectorIcon
            groupName="AntDesign"
            name="arrowright"
            size={20}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <Text
          style={{
            ...commonStyles.font20navy,
            paddingHorizontal: 20,
            marginTop: 15,
          }}>
          Favourites
        </Text>
        <SizeBox size={10} />
        <View>
          <FlatList
            data={DATA}
            renderItem={renderTourList}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <SizeBox size={20} />}
          />
        </View>
        <SizeBox size={45} />
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          bottom: Platform.OS == 'android' ? 90 : 80,
          right: 20,
        }}
        onPress={() => navigation.navigate('Cart')}>
        <Image
          source={ImagePath.Cart}
          resizeMode="contain"
          style={{
            height: 50,
            width: 50,
            bottom: Platform.OS == 'android' ? 2 : 30,
          }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Wishlist;
