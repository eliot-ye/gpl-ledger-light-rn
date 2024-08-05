import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

export function useDimensions(type: 'window' | 'screen') {
  const [scaledSize, scaledSizeSet] = useState(Dimensions.get(type));

  useEffect(() => {
    const ev = Dimensions.addEventListener('change', ({window, screen}) => {
      if (type === 'screen') {
        scaledSizeSet(screen);
      }
      if (type === 'window') {
        scaledSizeSet(window);
      }
    });

    return () => ev.remove();
  }, [type]);

  return scaledSize;
}

const breakpointWidth = {
  default: 0,
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

export type BreakpointWidthSelectOptions<T> = {
  [key in keyof typeof breakpointWidth]?: T;
};
export type BreakpointWidthSelectOptionsWidthDefault<T> =
  BreakpointWidthSelectOptions<T> & {default: T};

export const WindowSize = {
  useDimensions,
  breakpointWidth,
  /**
   * 根据宽度选择不同的数据，默认使用 `default` 值
   * @param option
   * @returns
   */
  select<T>(
    option: BreakpointWidthSelectOptionsWidthDefault<T>,
    width?: number,
  ) {
    const clientWidth = width ?? Dimensions.get('window').width;

    if (clientWidth > breakpointWidth.xxl && option.xxl !== undefined) {
      return option.xxl;
    } else if (clientWidth > breakpointWidth.xl && option.xl !== undefined) {
      return option.xl;
    } else if (clientWidth > breakpointWidth.lg && option.lg !== undefined) {
      return option.lg;
    } else if (clientWidth > breakpointWidth.md && option.md !== undefined) {
      return option.md;
    } else if (clientWidth > breakpointWidth.sm && option.sm !== undefined) {
      return option.sm;
    } else if (clientWidth > breakpointWidth.xs && option.xs !== undefined) {
      return option.xs;
    }

    return option.default;
  },

  /**
   * 根据屏幕宽度选择不同的数据，默认使用 `default` 值
   * @param option
   * @returns
   */
  useSelect<T>(option: BreakpointWidthSelectOptionsWidthDefault<T>) {
    const [data, setData] = useState(option.default);

    useEffect(() => {
      setData(WindowSize.select(option));

      const ev = Dimensions.addEventListener('change', ({window}) => {
        setData(WindowSize.select(option, window.width));
      });

      return () => {
        ev.remove();
      };
    }, []);

    return data;
  },
} as const;
