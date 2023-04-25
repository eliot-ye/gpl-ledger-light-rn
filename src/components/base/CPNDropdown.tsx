import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  FlatListProps,
  Modal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {StyleGet} from '@/configs/styles';
import {CPNText} from './CPNText';
import {Colors} from '@/configs/colors';
import {CPNIonicons, IONName} from './CPNIcon';
import {I18n} from '@/assets/I18n';
import {FormItemContext} from './CPNFormItem';

const Config = {
  borderWidth: 0.5,
  itemShowNum: 3,
  offset: 0,
} as const;
const styles = StyleSheet.create({
  cell: {
    ...StyleGet.cellView(),
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    ...StyleGet.boxShadow(),
    position: 'absolute',
  },
});

export interface DataConstraint {
  label?: string;
  value: any;
}

interface CPNDropdownProps<ItemT extends DataConstraint>
  extends Partial<FlatListProps<ItemT>> {
  itemShowNum?: number;
  /**
   * ___use memoized value___
   * ### 预定义字段：
   * ```
   * export interface DataConstraint {
   *   label?: string;
   *   value: any;
   * }
   * ```
   * */
  data: ItemT[];
  checked?: ItemT['value'];
  onSelect?: (item: ItemT) => void;
  numberOfLines?: number;
  cellStyle?: StyleProp<ViewStyle>;
  renderCellContent?: (item?: ItemT) => React.ReactNode;
  itemStyle?: StyleProp<ViewStyle>;
  renderItemContent?: (item: ItemT) => React.ReactNode;
  selectPlaceholder?: string;
  disabled?: boolean;
}

export function CPNDropdown<ItemT extends DataConstraint>(
  props: CPNDropdownProps<ItemT>,
) {
  const formItem = useContext(FormItemContext);

  const [show, showSet] = useState(false);

  const [boxPosition, boxPositionSet] = useState({Y: 0, X: 0});
  const [boxWidth, boxWidthSet] = useState(0);
  const [boxHeight, boxHeightSet] = useState(0);

  const containerHeight = useMemo(
    () => boxHeight * (props.itemShowNum || Config.itemShowNum),
    [boxHeight, props.itemShowNum],
  );

  const windowHeight = useWindowDimensions().height;
  const isShowBottom = useMemo(() => {
    return containerHeight + boxPosition.Y < windowHeight - 100;
  }, [boxPosition.Y, containerHeight, windowHeight]);

  const [activeItem, activeItemSet] = useState<ItemT>();
  const [activeIndex, activeIndexSet] = useState(0);

  useEffect(() => {
    props.data.forEach((_item, _index) => {
      if (_item.value === props.checked) {
        activeItemSet(_item);
        activeIndexSet(_index);
      }
    });
  }, [props.checked, props.data]);

  const FLRef = useRef<FlatList>(null);
  useEffect(() => {
    setTimeout(() => {
      FLRef.current?.scrollToOffset({
        animated: false,
        offset: isShowBottom
          ? activeIndex * (boxHeight + Config.borderWidth)
          : (activeIndex - 2) * (boxHeight + Config.borderWidth),
      });
    }, 0);
  }, [activeIndex, boxHeight, isShowBottom, show]);

  return (
    <>
      <TouchableOpacity
        accessible
        disabled={props.disabled || props.data.length === 0}
        onLayout={ev => {
          boxWidthSet(ev.nativeEvent.layout.width);
          boxHeightSet(ev.nativeEvent.layout.height);
        }}
        style={[
          styles.cell,
          {
            backgroundColor: Colors.backgroundPanel,
            paddingRight: 10,
          },
          props.cellStyle,
        ]}
        onPress={ev => {
          boxPositionSet({
            Y: ev.nativeEvent.pageY - ev.nativeEvent.locationY,
            X: ev.nativeEvent.pageX - ev.nativeEvent.locationX + Config.offset,
          });
          if (props.data.length > 0) {
            showSet(true);
          }
        }}>
        <View pointerEvents="none" style={{flex: 1}}>
          {props.renderCellContent ? (
            props.renderCellContent(activeItem)
          ) : (
            <CPNText
              numberOfLines={props.numberOfLines}
              style={[
                StyleGet.title('h4'),
                {
                  color: formItem.hasError
                    ? Colors.fail
                    : activeItem
                    ? Colors.fontText
                    : Colors.fontPlaceholder,
                },
                props.disabled && {color: Colors.backgroundDisabled},
              ]}>
              {activeItem?.label ||
                activeItem?.value ||
                props.selectPlaceholder ||
                I18n.SelectPlaceholder}
            </CPNText>
          )}
        </View>
        <CPNIonicons
          pointerEvents="none"
          name={IONName.DropDown}
          color={props.disabled ? Colors.backgroundDisabled : Colors.fontTitle}
          size={16}
        />
      </TouchableOpacity>
      <Modal
        visible={show}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => showSet(false)}>
        <TouchableWithoutFeedback onPress={() => showSet(false)}>
          <View style={StyleGet.windowSize()}>
            <View
              style={[
                styles.container,
                isShowBottom
                  ? {top: boxPosition.Y + Config.offset}
                  : {
                      bottom:
                        windowHeight -
                        boxHeight -
                        boxPosition.Y +
                        Config.offset,
                    },
                {
                  left: boxPosition.X,
                  backgroundColor: Colors.backgroundPanel,
                  width: boxWidth,
                  maxHeight: containerHeight,
                },
              ]}>
              <FlatList
                {...props}
                ref={FLRef}
                getItemLayout={(data, index) => ({
                  length: boxHeight + Config.borderWidth,
                  offset: (boxHeight + Config.borderWidth) * index,
                  index,
                })}
                ItemSeparatorComponent={
                  (
                    <View
                      style={{
                        borderBottomWidth: Config.borderWidth,
                        borderColor: Colors.line,
                        marginHorizontal: 6,
                      }}
                    />
                  ) as any
                }
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.cell,
                        {height: boxHeight},
                        props.itemStyle,
                      ]}
                      onPress={() => {
                        props.onSelect && props.onSelect(item);
                        showSet(false);
                      }}>
                      {props.renderItemContent ? (
                        props.renderItemContent(item)
                      ) : (
                        <CPNText numberOfLines={props.numberOfLines}>
                          {item.label || item.value}
                        </CPNText>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
