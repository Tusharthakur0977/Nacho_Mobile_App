import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {Colors} from '../Styles/colors';

type VectorIconProps = {
  groupName: keyof typeof VectorIcons;
  name: string;
  size: number;
  style?: any;
  color?: string;
  onPress?: () => void;
};

const colordef = Colors.white;

const VectorIcons = {
  AntDesign,
  MaterialIcons,
  EvilIcons,
  Entypo,
  FontAwesome,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  Zocial,
  Octicons,
  SimpleLineIcons,
  Fontisto,
  FontAwesome5,
  Feather,
  FontAwesome6,
};

const VectorIcon: React.FC<VectorIconProps> = ({
  groupName,
  name,
  size,
  style,
  color,
  onPress,
}) => {
  const IconComponent = VectorIcons[groupName];
  return (
    <IconComponent
      name={name}
      size={size}
      style={style}
      color={color != null ? color : colordef}
      onPress={onPress}
    />
  );
};

export default VectorIcon;
