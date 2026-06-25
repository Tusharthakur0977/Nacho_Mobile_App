/* eslint-disable react/react-in-jsx-scope */
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../Styles/colors';
import {moderateScaleVertical} from '../../Styles/responsiveSize';
import styles from '../style';
import VectorIcon from '../vectorIcons';

export function SizeBox({size}: SizeBoxProps) {
  return <View style={{marginVertical: moderateScaleVertical(size)}} />;
}

export function CommonBtn({
  onPress,
  title,
  isDisabled = false,
}: CommonBtnProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.loginButton, {opacity: isDisabled ? 0.5 : 1}]}>
      <Text style={styles.loginButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function CommonInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  onFocus,
  keyboardType,
}: CommonInputProps) {
  return (
    <View>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={Colors.greyTxt}
        value={value}
        autoCapitalize="none"
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        keyboardType={keyboardType}
      />
    </View>
  );
}

export function CommonPassword({
  placeholder,
  value,
  secureTextEntry,
  name,
  groupName,
  onPress,
  autoCapitalize,
  onChangeText,
  size,
}: CommonPassInputProps) {
  return (
    <View style={styles.passwordtxtipt}>
      <TextInput
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        onChangeText={onChangeText}
        placeholderTextColor={Colors.greyTxt}
        style={{width: '95%', color: Colors.black}}
      />
      <TouchableOpacity onPress={onPress} style={{marginLeft: 10}}>
        <VectorIcon
          groupName={groupName}
          name={name}
          size={size}
          color={Colors.secondaryfont}
        />
      </TouchableOpacity>
    </View>
  );
}

export function FormattedDate({
  title,
  color,
}: {
  title?: string;
  color?: string;
}) {
  if (!title?.includes(' / ')) {
    return <Text style={styles.dates}>N/A</Text>;
  }

  const splitTitle = title?.split(' / ')[0];
  const start = splitTitle?.split(' - ')[0].split(' ');
  const end = splitTitle?.split(' - ')[1].split(' ');

  return (
    <Text style={[styles.dates, {color}]}>
      {`${start[0]} ${start[1].slice(0, 3)} ${start[2]} - ${
        end[0]
      } ${end[1].slice(0, 3)} ${end[2]}`}
    </Text>
  );
}


// export function CommonDateInput({
//   label,
//   placeholderTextColor = Colors.black,
//   value,
//   onChangeText,
//   showIcon = false,
//   iconName = 'pencil-outline',
//   iconGroupName = 'MaterialCommunityIcons',
//   iconSize = 20,
//   onIconPress,
// }: CommonDateInputProps) {
//   return (
//     <View style={styles.dateInput}>
//       <Text style={styles.label}>{label}</Text>
//       <View style={styles.inputWrapper}>
//         <TextInput
//           value={value}
//           onChangeText={onChangeText}
//           placeholderTextColor={placeholderTextColor}
//           style={[styles.input, showIcon && {width: '90%'}]}
//         />
//         {showIcon && (
//           <TouchableOpacity onPress={onIconPress}>
//             <VectorIcon
//               groupName={iconGroupName}
//               name={iconName}
//               size={iconSize}
//               color={Colors.black}
//             />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }




