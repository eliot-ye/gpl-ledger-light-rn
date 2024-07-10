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
import {StyleGet} from '@/assets/styles';
import {CPNText} from './CPNText';
import {Colors} from '@/assets/colors';
import {CPNIonicons, IONName} from './CPNIcon';
import {I18n} from '@/assets/I18n';
import {FormItemContext} from './CPNFormItem';
import {CPNPageViewThemeColor} from './CPNPageView';
import {useDimensions} from '@/utils/useDimensions';

const Config = {
  borderWidth: 1,
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
  onChange?: (item: ItemT) => void;
  numberOfLines?: number;
  cellStyle?: StyleProp<ViewStyle>;
  renderCellContent?: (item?: ItemT) => React.ReactNode;
  itemStyle?: StyleProp<ViewStyle>;
  renderItemContent?: (item: ItemT) => React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

export function CPNDropdown<ItemT extends DataConstraint>(
  props: Readonly<CPNDropdownProps<ItemT>>,
) {
  I18n.useLangCode();

  const formItem = useContext(FormItemContext);
  const pageViewThemeColor = useContext(CPNPageViewThemeColor);
  const themeColor =
    (formItem.themeColor ?? pageViewThemeColor) || Colors.theme;

  const [show, setShow] = useState(false);

  const [boxPosition, setBoxPosition] = useState({Y: 0, X: 0});
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);

  const containerHeight = useMemo(
    () =>
      (boxHeight + Config.borderWidth) *
        (props.itemShowNum ?? Config.itemShowNum) -
      Config.borderWidth,
    [boxHeight, props.itemShowNum],
  );

  const prevCount = Math.floor((props.itemShowNum ?? Config.itemShowNum) / 2);
  const dataShow = useMemo(() => {
    const _data = [...props.data];
    for (let i = 0; i < prevCount; i++) {
      _data.unshift({value: '_prev_id_f_' + i} as ItemT);
      _data.push({value: '_prev_id_e_' + i} as ItemT);
    }
    return _data;
  }, [prevCount, props.data]);

  const [activeItem, setActiveItem] = useState<ItemT>();
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const _activeItem = dataShow.find((_item, _index) => {
      if (_item.value === props.checked) {
        setActiveIndex(_index);
      }
      return _item.value === props.checked;
    });
    setActiveItem(_activeItem);
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
          setBoxWidth(ev.nativeEvent.layout.width);
          setBoxHeight(ev.nativeEvent.layout.height);
        }}
        style={[
          styles.cell,
          {
            backgroundColor: Colors.backgroundPanel,
            borderColor: Colors.line,
            borderWidth: Config.borderWidth,
          },
          activeItem && {borderColor: themeColor},
          formItem.hasError && {borderColor: Colors.fail},
          props.cellStyle,
        ]}
        onPress={ev => {
          setBoxPosition({
            Y: ev.nativeEvent.pageY - ev.nativeEvent.locationY,
            X: ev.nativeEvent.pageX - ev.nativeEvent.locationX + Config.offset,
          });
          if (props.data.length > 0) {
            setShow(true);
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
              {(activeItem?.label ?? activeItem?.value) ||
                (props.placeholder ??
                  I18n.t('PlaceholderSelect', formItem.title))}
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
        onRequestClose={() => setShow(false)}>
        <TouchableWithoutFeedback onPress={() => setShow(false)}>
          <View style={windowSize}>
            <View
              style={[
                styles.container,
                {
                  borderColor: themeColor,
                  borderWidth: Config.borderWidth,
                  top:
                    boxPosition.Y +
                    Config.offset -
                    boxHeight * prevCount -
                    Config.borderWidth,
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
                  const _borderWidth = Config.borderWidth / 2;
                  if (
                    String(ev.leadingItem.value).startsWith('_prev_id_') &&
                    ev.leadingItem.value !== '_prev_id_f_0'
                  ) {
                    return (
                      <View
                        style={{
                          height: Config.borderWidth,
                          marginHorizontal: 6,
                        }}
                      />
                    );
                  }
                  return (
                    <View
                      style={{
                        height: _borderWidth,
                        borderBottomWidth: _borderWidth,
                        borderColor: Colors.line,
                        marginHorizontal: 6,
                      }}
                    />
                  );
                }}
                renderItem={({item}) => {
                  if (String(item.value).startsWith('_prev_id_')) {
                    if (
                      item.value === '_prev_id_f_0' ||
                      item.value === '_prev_id_e_0'
                    ) {
                      return (
                        <TouchableWithoutFeedback
                          onPress={() => setShow(false)}>
                          <View
                            style={[
                              {
                                paddingHorizontal: Config.borderWidth,
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
                      <TouchableWithoutFeedback onPress={() => setShow(false)}>
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
                        props.onChange && props.onChange(item);
                        setShow(false);
                      }}>
                      {props.renderItemContent ? (
                        props.renderItemContent(item)
                      ) : (
                        <CPNText
                          style={{flex: 1}}
                          numberOfLines={props.numberOfLines}>
                          {item.label ?? item.value}
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
