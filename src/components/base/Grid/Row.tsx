import React, {createContext, memo, useMemo, useState} from 'react';
import {Dimensions, View, ViewProps} from 'react-native';

export const RowContext = createContext({
  isInRow: false,
  gap: 0,
  rowWidth: 0,
});

interface RowProps extends ViewProps {
  /**
   * 列元素之间的间距
   * @default 0
   */
  gap?: number;
}

function Row(props: Readonly<RowProps>) {
  const [rowWidth, setRowWidth] = useState(Dimensions.get('window').width);

  const ctx = useMemo(
    () => ({isInRow: true, gap: props.gap ?? 0, rowWidth}),
    [props.gap, rowWidth],
  );
  return (
    <RowContext.Provider value={ctx}>
      <View
        {...props}
        // @ts-ignore
        gap={0}
        style={[
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
            margin: -(+ctx.gap / 2),
          },
          props.style,
        ]}
        onLayout={event => {
          setRowWidth(event.nativeEvent.layout.width);
        }}
      />
    </RowContext.Provider>
  );
}

export default memo(Row);
