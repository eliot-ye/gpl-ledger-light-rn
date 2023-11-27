import {Dimensions} from 'react-native';
import {Colors} from './colors';

const titleMap = {
  h2: 20,
  h3: 18,
  h4: 16,
  h5: 14,
} as const;
type TitleType = keyof typeof titleMap;
function title<T extends TitleType>(type: T, isReverse?: boolean) {
  return {
    fontSize: titleMap[type],
    color: isReverse ? Colors.fontTitleReverse : Colors.fontTitle,
  } as const;
}

type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

const windowSize = Dimensions.get('window');
const screenSize = Dimensions.get('screen');

export const StyleGet = {
  title,

  windowSize() {
    return {
      width: windowSize.width,
      height: windowSize.height,
    } as const;
  },
  modalView(justifyContent?: JustifyContent) {
    return {
      width: screenSize.width,
      height: screenSize.height,
      backgroundColor: Colors.backgroundModal,
      justifyContent: justifyContent || 'center',
      alignItems: 'center',
      overflow: 'hidden',
    } as const;
  },

  boxShadow() {
    return {
      shadowOffset: {width: 0, height: 0} as const,
      shadowColor: Colors.shadow,
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 5,
    } as const;
  },

  cellTitleView() {
    return {
      height: 24,
    } as const;
  },
  cellView() {
    return {
      minHeight: 46,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderWidth: 0,
      borderColor: Colors.line,
    } as const;
  },
} as const;
