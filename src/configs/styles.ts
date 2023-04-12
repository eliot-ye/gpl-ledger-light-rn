import {StyleSheet} from 'react-native';
import {Colors} from './colors';

export const BaseStyles = StyleSheet.create({
  boxShadow: {
    shadowOffset: {width: 0, height: 0} as const,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  } as const,

  cellTitle: {
    height: 20,
  } as const,
  cell: {
    height: 46,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: Colors.transparent,
  } as const,
});
