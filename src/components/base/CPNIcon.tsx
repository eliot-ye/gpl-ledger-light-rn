import {Colors} from '@/configs/colors';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextProps} from 'react-native/types';

interface CPNIconProps extends TextProps {
  /** @default 26 */
  size?: number;
  /** @default Colors.fontTitleReverse */
  color?: string;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
}

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

  Home = 'home',
  Settings = 'settings',
}
interface IoniconsProps extends CPNIconProps {
  name?: IONName;
}
export function CPNIonicons(props: IoniconsProps) {
  return <Ionicons size={26} color={Colors.fontTitleReverse} {...props} />;
}
