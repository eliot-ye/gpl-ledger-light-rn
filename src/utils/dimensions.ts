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
  /** `>= 0` */
  default: 0,
  /** `>= 320` */
  xs: 320,
  /**` >= 375` */
  sm: 375,
  /** `>= 600` */
  md: 600,
  /** `>= 840` */
  lg: 840,
  /** `>= 1440` */
  xl: 1440,
} as const;

export type BreakpointType = keyof typeof breakpointWidth;

export type BreakpointWidthSelectOptions<T> = {
  [key in keyof typeof breakpointWidth]?: T;
};
export type BreakpointWidthSelectOptionsWidthRequired<T> =
  BreakpointWidthSelectOptions<T> & {default: T};

export enum WindowShape {
  Horizontal = 1,
  Vertical = 2,
  Square = 3,
}

export const WindowSize = {
  useDimensions,
  breakpointWidth,
  getWindowWidthBreakpoint(width?: number): BreakpointType {
    const clientWidth = width ?? Dimensions.get('window').width;
    if (clientWidth >= breakpointWidth.xl) {
      return 'xl';
    }
    if (clientWidth >= breakpointWidth.lg) {
      return 'lg';
    }
    if (clientWidth >= breakpointWidth.md) {
      return 'md';
    }
    if (clientWidth >= breakpointWidth.sm) {
      return 'sm';
    }
    if (clientWidth >= breakpointWidth.xs) {
      return 'xs';
    }
    return 'default';
  },
  getWindowShape({width, height}: {width?: number; height?: number} = {}) {
    const scaledSize = Dimensions.get('window');
    const clientWidth = width ?? scaledSize.width;
    const clientHeight = height ?? scaledSize.height;
    const proportion = clientWidth / clientHeight;
    if (proportion < 0.8) {
      return WindowShape.Vertical;
    }
    if (proportion > 1.2) {
      return WindowShape.Horizontal;
    }
    return WindowShape.Square;
  },
  /**
   * 根据宽度选择不同的数据，默认使用 `xxs` 值
   * @param option
   * @returns
   */
  select<T>(
    option: BreakpointWidthSelectOptionsWidthRequired<T>,
    width?: number,
  ) {
    const breakpointType: BreakpointType =
      WindowSize.getWindowWidthBreakpoint(width);

    if (breakpointType === 'xl' && option.xl !== undefined) {
      return option.xl;
    }
    if (breakpointType === 'lg' && option.lg !== undefined) {
      return option.lg;
    }
    if (breakpointType === 'md' && option.md !== undefined) {
      return option.md;
    }
    if (breakpointType === 'sm' && option.sm !== undefined) {
      return option.sm;
    }
    if (breakpointType === 'xs' && option.xs !== undefined) {
      return option.xs;
    }

    return option.default;
  },

  /**
   * 根据屏幕宽度选择不同的数据，默认使用 `default` 值
   * @param option
   * @returns
   */
  useSelect<T>(option: BreakpointWidthSelectOptionsWidthRequired<T>) {
    const [data, setData] = useState(option.default);

    useEffect(() => {
      setData(WindowSize.select(option));

      const ev = Dimensions.addEventListener('change', ({window}) => {
        setData(WindowSize.select(option, window.width));
      });

      return () => {
        ev.remove();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return data;
  },
} as const;
