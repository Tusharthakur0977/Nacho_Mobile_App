/* eslint-disable @typescript-eslint/no-unused-vars */

interface SizeBoxProps {
  size: number;
}

interface CommonBtnProps {
  onPress: () => void;
  title: string;
  isDisabled?: boolean;
}

interface CommonInputProps {
  placeholder: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'visible-password';
}
interface CommonPassInputProps {
  placeholder: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  value?: string;
  name: string;
  groupName:
    | 'AntDesign'
    | 'MaterialIcons'
    | 'EvilIcons'
    | 'Entypo'
    | 'FontAwesome'
    | 'Foundation'
    | 'Ionicons'
    | 'MaterialCommunityIcons'
    | 'Zocial'
    | 'Octicons'
    | 'SimpleLineIcons'
    | 'Fontisto'
    | 'FontAwesome5'
    | 'Feather'
    | 'FontAwesome6';
  onPress?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  size: number;
  onChangeText?: (text: string) => void;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'visible-password';
}
interface CommonDateInputProps {
  placeholder: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  value?: string;
  name: string;
  label: string;
  placeholderTextColor: string;
  showIcon?: boolean;
  iconName: string;
  iconSize: number;
  iconGroupName:
    | 'AntDesign'
    | 'MaterialIcons'
    | 'EvilIcons'
    | 'Entypo'
    | 'FontAwesome'
    | 'Foundation'
    | 'Ionicons'
    | 'MaterialCommunityIcons'
    | 'Zocial'
    | 'Octicons'
    | 'SimpleLineIcons'
    | 'Fontisto'
    | 'FontAwesome5'
    | 'Feather'
    | 'FontAwesome6';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  size: number;
  onIconPress?: () => void;
  onChangeText?: (text: string) => void;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'visible-password';
}

