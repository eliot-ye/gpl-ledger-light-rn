import {Colors} from '@/assets/colors';
import React from 'react';
import {IconProps} from 'react-native-vector-icons/Icon';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Ionicons name
 * @see https://ionic.io/ionicons/
 * */
export enum IONName {
  Back = 'chevron-back',
  BackCircle = 'chevron-back-circle',

  ChevronForward = 'chevron-forward',

  Slider = 'swap-horizontal',

  Close = 'close',
  CloseCircle = 'close-circle',

  DropDown = 'caret-down',

  Refresh = 'reload-circle',

  Checkmark = 'checkmark-sharp',
  CheckboxMarkedCircleOutline = 'checkmark-circle-outline',

  AlertCircleOutline = 'alert-circle-outline',

  Eye = 'eye',
  EyeOff = 'eye-off',

  Add = 'add',
  Delete = 'trash',

  FingerPrint = 'finger-print',

  Home = 'home',
  Settings = 'settings',
}

type IoniconsProps = IconProps & {
  pointerEvents?: 'auto' | 'box-none' | 'none' | 'box-only';
  name?: IONName;
};
export function CPNIonicons(props: Readonly<IoniconsProps>) {
  return (
    <Ionicons
      size={26}
      color={Colors.fontTitleReverse}
      accessibilityLabel={props.name}
      {...props}
    />
  );
}
