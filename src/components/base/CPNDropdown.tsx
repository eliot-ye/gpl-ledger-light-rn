import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  FlatListProps,
  Modal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {StyleGet} from '@/configs/styles';
import {CPNText} from './CPNText';
import {Colors} from '@/configs/colors';
import {CPNIonicons, IONName} from './CPNIcon';
import {I18n} from '@/assets/I18n';
import {FormItemContext} from './CPNFormItem';
import {CPNPageViewThemeColor} from './CPNPageView';
import {useDimensions} from '@/utils/useDimensions';

const Config = {
  borderWidth: 0.5,
  itemShowNum: 5,
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
  id?: string;
  label?: string;
  /** 注意：value 不可以 `_prev_id_` 字符开头 */
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
   * ___注意：`value` 不可以 `_prev_id_` 字符开头___
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
  I18n.useLocal();

  const formItem = useContext(FormItemContext);
  const pageViewThemeColor = useContext(CPNPageViewThemeColor);
  const themeColor = formItem.themeColor || pageViewThemeColor || Colors.theme;

  const [show, showSet] = useState(false);

  const [boxPosition, boxPositionSet] = useState({Y: 0, X: 0});
  const [boxWidth, boxWidthSet] = useState(0);
  const [boxHeight, boxHeightSet] = useState(0);

  const containerHeight = useMemo(
    () => boxHeight * (props.itemShowNum || Config.itemShowNum),
    [boxHeight, props.itemShowNum],
  );

  const prevCount = Math.floor((props.itemShowNum || Config.itemShowNum) / 2);
  const dataShow = useMemo(() => {
    const _data = [...props.data];
    for (let i = 0; i < prevCount; i++) {
      _data.unshift({value: '_prev_id_f_' + i} as ItemT);
      _data.push({value: '_prev_id_e_' + i} as ItemT);
    }
    return _data;
  }, [prevCount, props.data]);

  const [activeItem, activeItemSet] = useState<ItemT>();
  const [activeIndex, activeIndexSet] = useState(0);
  useEffect(() => {
    dataShow.forEach((_item, _index) => {
      if (_item.value === props.checked) {
        activeItemSet(_item);
        activeIndexSet(_index);
      }
    });
  }, [props.checked, dataShow]);

  const FLRef = useRef<FlatList>(null);
  useEffect(() => {
    setTimeout(() => {
      FLRef.current?.scrollToOffset({
        animated: false,
        offset: (activeIndex - 2) * (boxHeight + Config.borderWidth),
      });
    }, 0);
  }, [activeIndex, boxHeight, show]);

  const windowSize = useDimensions('window');

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
            borderBottomColor: Colors.line,
          },
          activeItem && {borderBottomColor: themeColor},
          formItem.hasError && {borderBottomColor: Colors.fail},
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
                {color: Colors.fontPlaceholder},
                activeItem && {color: Colors.fontText},
                props.disabled && {color: Colors.backgroundDisabled},
              ]}>
              {activeItem?.label ||
                activeItem?.value ||
                (props.selectPlaceholder === undefined
                  ? I18n.t('PlaceholderSelect', formItem.title)
                  : props.selectPlaceholder)}
            </CPNText>
          )}
        </View>
        <View pointerEvents="none">
          <CPNIonicons
            pointerEvents="none"
            name={IONName.DropDown}
            color={
              props.disabled ? Colors.backgroundDisabled : Colors.fontTitle
            }
            size={16}
          />
        </View>
      </TouchableOpacity>
      <Modal
        visible={show}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => showSet(false)}>
        <TouchableWithoutFeedback onPress={() => showSet(false)}>
          <View style={windowSize}>
            <View
              style={[
                styles.container,
                {
                  borderColor: themeColor,
                  borderWidth: Config.borderWidth,
                  top: boxPosition.Y + Config.offset - boxHeight * prevCount,
                  left: boxPosition.X,
                  backgroundColor: Colors.backgroundPanel,
                  width: boxWidth,
                  maxHeight: containerHeight,
                },
              ]}>
              <FlatList
                {...props}
                data={dataShow}
                ref={FLRef}
                getItemLayout={(data, index) => ({
                  length: boxHeight + Config.borderWidth,
                  offset: (boxHeight + Config.borderWidth) * index,
                  index,
                })}
                ItemSeparatorComponent={ev => {
                  if (ev.leadingItem.value.includes('_prev_id_')) {
                    if (ev.leadingItem.value === '_prev_id_f_0') {
                      return (
                        <View
                          style={{
                            height: Config.borderWidth,
                            backgroundColor: Colors.line,
                            marginHorizontal: 6,
                          }}
                        />
                      );
                    }
                    return (
                      <View
                        style={{
                          height: Config.borderWidth,
                          backgroundColor: Colors.transparent,
                          marginHorizontal: 6,
                        }}
                      />
                    );
                  }
                  return (
                    <View
                      style={{
                        height: Config.borderWidth,
                        backgroundColor: Colors.line,
                        marginHorizontal: 6,
                      }}
                    />
                  );
                }}
                renderItem={({item}) => {
                  if (item.value.indexOf('_prev_id_') === 0) {
                    if (
                      item.value === '_prev_id_f_0' ||
                      item.value === '_prev_id_e_0'
                    ) {
                      return (
                        <TouchableWithoutFeedback
                          onPress={() => showSet(false)}>
                          <View
                            style={[
                              {
                                height: boxHeight,
                                alignItems: 'center',
                                justifyContent:
                                  item.value === '_prev_id_f_0'
                                    ? 'flex-start'
                                    : 'flex-end',
                              },
                              props.itemStyle,
                            ]}>
                            <CPNText
                              style={{
                                color: Colors.fontPlaceholder,
                                fontSize: 12,
                              }}>
                              {I18n.t('NoMoreOptions')}
                            </CPNText>
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    }
                    return (
                      <TouchableWithoutFeedback onPress={() => showSet(false)}>
                        <View style={[{height: boxHeight}, props.itemStyle]} />
                      </TouchableWithoutFeedback>
                    );
                  }
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
                        <CPNText
                          style={{flex: 1}}
                          numberOfLines={props.numberOfLines}>
                          {item.label || item.value}
                        </CPNText>
                      )}
                      {props.checked === item.value && (
                        <CPNIonicons
                          name={IONName.Checkmark}
                          color={themeColor}
                        />
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
