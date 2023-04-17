import {Colors} from './colors';

const titleMap = {
  h2: 20,
  h3: 18,
  h4: 16,
} as const;
type TitleType = keyof typeof titleMap;
function title<T extends TitleType>(type: T, isReverse?: boolean) {
  return {
    fontSize: titleMap[type],
    color: isReverse ? Colors.fontTitleReverse : Colors.fontTitle,
  } as const;
}

export const StyleGet = {
  title,

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
      height: 20,
    } as const;
  },
  cellView() {
    return {
      height: 46,
      paddingHorizontal: 10,
      borderWidth: 2,
      borderColor: Colors.transparent,
    } as const;
  },
} as const;
