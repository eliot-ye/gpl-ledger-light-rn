import {ColorsInstance} from '@/assets/colors';
import React, {useContext} from 'react';
import {IconProps} from 'react-native-vector-icons/Icon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FontColorContext} from './CPNText';

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

  RemoveOutline = 'remove-outline',
  EllipseOutline = 'ellipse-outline',
}

type IoniconsProps = IconProps & {
  pointerEvents?: 'auto' | 'box-none' | 'none' | 'box-only';
  name?: IONName;
};
export function CPNIonicons(props: Readonly<IoniconsProps>) {
  const fontTextColor = ColorsInstance.useConstant('fontText');
  const colorDefault = useContext(FontColorContext) || fontTextColor;

  return (
    <Ionicons
      size={26}
      color={colorDefault}
      accessibilityLabel={props.name}
      {...props}
    />
  );
}
