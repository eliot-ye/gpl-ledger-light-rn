import React, {memo, useContext, useMemo} from 'react';
import {DimensionValue, View, ViewProps} from 'react-native';
import {RowContext} from './Row';
import {CPNText} from '..';
import {Colors} from '@/assets/colors';
import {breakpointWidth} from '@/utils/dimensions';

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
  span?: ColSpan;
  /**
   * 单元格宽度，Row 组件的宽度大于等于 520 时生效
   */
  span_md?: ColSpan;
  /**
   * 单元格宽度，Row 组件的宽度大于等于 840 时生效
   */
  span_lg?: ColSpan;
  /**
   * 单元格默认偏移量
   * @default 0
   */
  offset?: ColSpan;
  /**
   * 单元格偏移量，Row 组件的宽度大于等于 520 时生效
   */
  offset_md?: ColSpan;
  /**
   * 单元格偏移量，Row 组件的宽度大于等于 840 时生效
   */
  offset_lg?: ColSpan;
}

function Col(props: Readonly<ColProps>) {
  const {gap, rowWidth, isInRow} = useContext(RowContext);

  const width: DimensionValue = useMemo<DimensionValue>(() => {
    if (rowWidth >= breakpointWidth.lg && props.span_lg !== undefined) {
      return `${props.span_lg * BASE_SPAN_WIDTH}%`;
    } else if (rowWidth >= breakpointWidth.md && props.span_md !== undefined) {
      return `${props.span_md * BASE_SPAN_WIDTH}%`;
    }
    return `${(props.span ?? 24) * BASE_SPAN_WIDTH}%`;
  }, [props.span, props.span_md, props.span_lg, rowWidth]);

  const marginStart: DimensionValue = useMemo<DimensionValue>(() => {
    if (rowWidth >= breakpointWidth.lg && props.offset_lg !== undefined) {
      return `${props.offset_lg * BASE_SPAN_WIDTH}%`;
    } else if (
      rowWidth >= breakpointWidth.md &&
      props.offset_md !== undefined
    ) {
      return `${props.offset_md * BASE_SPAN_WIDTH}%`;
    }
    return `${(props.offset ?? 0) * BASE_SPAN_WIDTH}%`;
  }, [props.offset, props.offset_md, props.offset_lg, rowWidth]);

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
