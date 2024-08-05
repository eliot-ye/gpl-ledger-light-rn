import {memo, useContext, useMemo} from 'react';
import {DimensionValue, View, ViewProps} from 'react-native';
import {RowContext} from './Row';
import {CPNText} from '..';
import {Colors} from '@/assets/colors';
import {BreakpointWidthSelectOptions, WindowSize} from '@/utils/dimensions';

const BASE_SPAN_WIDTH = 100 / 24;

/** 单元格宽度比例，1 ~ 24 整数 */
type ColSpan =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

interface ColProps extends ViewProps {
  /**
   * 单元格默认宽度比例
   * @default 24
   */
  span?: ColSpan | BreakpointWidthSelectOptions<ColSpan>;
  /**
   * 单元格默认偏移量
   * @default 0
   */
  offset?: ColSpan | BreakpointWidthSelectOptions<ColSpan>;
}

function Col(props: Readonly<ColProps>) {
  const {gap, rowWidth, isInRow} = useContext(RowContext);

  const width: DimensionValue = useMemo<DimensionValue>(() => {
    if (typeof props.span === 'number') {
      return `${props.span * BASE_SPAN_WIDTH}%`;
    } else {
      const _ = WindowSize.select({default: 24, ...props.span}, rowWidth);
      return `${_ * BASE_SPAN_WIDTH}%`;
    }
  }, [props.span, rowWidth]);

  const marginStart: DimensionValue = useMemo<DimensionValue>(() => {
    if (typeof props.offset === 'number') {
      return `${props.offset * BASE_SPAN_WIDTH}%`;
    } else {
      const _ = WindowSize.select({default: 0, ...props.offset}, rowWidth);
      return `${_ * BASE_SPAN_WIDTH}%`;
    }
  }, [props.offset, rowWidth]);

  if (!isInRow) {
    return (
      <View>
        <CPNText style={{color: Colors.fail}}>
          Error: Col should be placed inside Row
        </CPNText>
      </View>
    );
  }

  return (
    <View
      {...props}
      style={[
        {
          flexGrow: 0,
          flexShrink: 0,
          width: width,
          padding: +gap / 2,
          marginStart,
        },
        props.style,
      ]}
    />
  );
}
export default memo(Col);
