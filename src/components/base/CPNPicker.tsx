import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  type NativeScrollEvent,
  type ScrollView,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {I18n} from '@assets/I18n';
import {Colors} from '@/assets/colors';
import {colorGetBackground, toTitleCase} from '@/utils/tools';
import {CPNText} from './CPNText';
import {DataConstraint} from './CPNDropdown';
import {CPNPageViewThemeColor} from './CPNPageView';

const Config = {
  itemHeight: 40,
  itemShowNum: 5,
  itemTextSize: 14,
  headerHeight: 40,
  selectBorderWidth: 2,
  selectTextSize: 18,
} as const;

interface ItemT extends DataConstraint {
  children?: ItemT[];
}
export type PickerData = ItemT[];
interface CPNPicker {
  /** ___use memoized value___ */
  data: PickerData;
  itemHeight?: number;
  /** 必须为单数，否则可能导致UI错误 */
  itemShowNum?: number;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectWatermark: {
    position: 'absolute',
    borderTopWidth: Config.selectBorderWidth,
    borderBottomWidth: Config.selectBorderWidth,
    width: '100%',
  },
  itemWrapper: {
    justifyContent: 'center',
  },
  itemText: {
    textAlign: 'center',
    opacity: 0.55,
    fontSize: Config.itemTextSize,
  },
});

interface PickerSingleProps extends CPNPicker {
  containerStyle?: StyleProp<ViewStyle>;
  scrollViewStyle?: StyleProp<ViewStyle>;
  initActive?: number;
  onChange?: (index: number) => void;
}
export function CPNPickerSingle(props: Readonly<PickerSingleProps>) {
  I18n.useLangCode();

  const themeColor = useContext(CPNPageViewThemeColor);

  const SVRef = useRef<ScrollView>(null);

  const [activeIndex, setActiveIndex] = useState(props.initActive ?? 0);

  const contentOffsetYMapping = useRef(new Animated.Value(0)).current;

  const itemHeight = props.itemHeight ?? Config.itemHeight;
  const itemShowNum = props.itemShowNum ?? Config.itemShowNum;

  const fillHeight = useMemo(
    () => itemHeight * Math.floor(itemShowNum / 2),
    [itemHeight, itemShowNum],
  );

  const getActiveIndex = useCallback(
    (contentOffsetY: number) => {
      const active =
        contentOffsetY % itemHeight > itemHeight / 2
          ? Math.ceil(contentOffsetY / itemHeight)
          : Math.floor(contentOffsetY / itemHeight);

      let index = active;
      if (index > props.data.length - 1) {
        index = props.data.length - 1;
      }
      if (index < 0) {
        index = 0;
      }

      return index;
    },
    [itemHeight, props.data.length],
  );

  useEffect(() => {
    if (SVRef.current) {
      setActiveIndex(props.initActive ?? 0);
      SVRef.current.scrollTo({y: itemHeight * (props.initActive ?? 0)});
    }
  }, [itemHeight, props.initActive]);

  const contentOffset = useRef({y: itemHeight * activeIndex, x: 0});
  return (
    <View style={[styles.container]}>
      <View
        style={[
          styles.container,
          props.containerStyle,
          {height: itemHeight * itemShowNum},
        ]}>
        <Animated.ScrollView
          ref={SVRef}
          style={[{width: '100%', height: '100%'}, props.scrollViewStyle]}
          contentOffset={contentOffset.current}
          showsVerticalScrollIndicator={false}
          scrollsToTop={false}
          onScroll={Animated.event<NativeScrollEvent>(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: contentOffsetYMapping,
                  },
                },
              },
            ],
            {
              useNativeDriver: true,
              listener: e => {
                const contentOffsetY = e.nativeEvent.contentOffset.y;
                const index = getActiveIndex(contentOffsetY);
                setActiveIndex(index);
              },
            },
          )}
          onScrollEndDrag={e => {
            const contentOffsetY = e.nativeEvent.contentOffset.y;
            const index = getActiveIndex(contentOffsetY);
            // console.log('onScrollEndDrag', index, activeIndex);

            if (index === activeIndex) {
              SVRef.current?.scrollTo({y: index * itemHeight, animated: false});
              contentOffsetYMapping.setValue(index * itemHeight);
              props.onChange && props.onChange(index);
            }
          }}
          onMomentumScrollEnd={e => {
            const contentOffsetY = e.nativeEvent.contentOffset.y;
            const index = getActiveIndex(contentOffsetY);
            // console.log('onMomentumScrollEnd', index, activeIndex);

            if (contentOffsetY !== index * itemHeight) {
              SVRef.current?.scrollTo({y: index * itemHeight, animated: false});
              contentOffsetYMapping.setValue(index * itemHeight);
              props.onChange && props.onChange(index);
            }
          }}>
          <View style={[{height: fillHeight}]} />
          {props.data.map((item, index) => {
            return (
              <Animated.View
                key={item.value}
                style={[styles.itemWrapper, {height: itemHeight}]}>
                <CPNText
                  style={[
                    styles.itemText,
                    {color: themeColor || Colors.theme},
                    index === activeIndex && {
                      opacity: 1,
                      fontSize: Config.selectTextSize,
                    },
                  ]}>
                  {item.label ?? item.value}
                </CPNText>
              </Animated.View>
            );
          })}
          <View style={[{height: fillHeight}]} />
        </Animated.ScrollView>
      </View>
      <View
        pointerEvents="none"
        style={[
          styles.selectWatermark,
          {borderColor: themeColor || Colors.theme, height: itemHeight},
        ]}
      />
    </View>
  );
}

const stylesModalPicker = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: Colors.backgroundModal,
    justifyContent: 'flex-end',
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btnText: {
    color: Colors.theme,
  },
  pickerContainer: {flexDirection: 'row'},
  columnContainer: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
  columnTitle: {
    paddingVertical: 10,
    marginHorizontal: 0.5,
    backgroundColor: colorGetBackground(Colors.theme),
    width: '99%',
  },
  columnTitleText: {
    textAlign: 'center',
    color: Colors.theme,
    fontSize: 18,
  },
});

interface ModalPickerProps extends CPNPicker {
  show: boolean;
  onClose: () => void;
  /** 数据层级，控制显示数据联动的层级(列数) */
  dataHierarchy: number;
  columnConfigs?: (
    | {
        containerStyle?: StyleProp<ViewStyle>;
        scrollViewStyle?: StyleProp<ViewStyle>;
        title?: string;
        titleContainerStyle?: StyleProp<ViewStyle>;
        titleTextStyle?: StyleProp<TextStyle>;
      }
    | undefined
    | null
  )[];
  onConfirm?: (
    itemList: (ItemT | undefined)[],
    indexList: (number | undefined)[],
  ) => void;
  confirmText?: string;
  cancelText?: string;
  initActiveList?: (number | undefined)[];
}
export function CPNModalPicker(props: Readonly<ModalPickerProps>) {
  I18n.useLangCode();

  const itemHeight = props.itemHeight ?? Config.itemHeight;
  const itemShowNum = props.itemShowNum ?? Config.itemShowNum;

  const [activeList, setActiveList] = useState<(number | undefined)[]>(
    props.initActiveList || [],
  );

  const [dataList, setDataList] = useState<{id: string; data: ItemT[]}[]>([]);
  useEffect(() => {
    let _dataList = [];
    let _data: ItemT[] = props.data;
    for (let i = 0; i < props.dataHierarchy; ++i) {
      _dataList.push({id: String(i), data: _data});
      _data = _data[activeList[i] ?? 0]?.children || [];
    }
    setDataList(_dataList);
  }, [activeList, props.data, props.dataHierarchy]);

  function renderPicker() {
    return (
      <View style={stylesModalPicker.pickerContainer}>
        {dataList.map((item, index) => {
          const columnConfigList = props.columnConfigs || [];
          const columnConfig = columnConfigList[index];

          return (
            <View key={item.id} style={[stylesModalPicker.columnContainer]}>
              {!!columnConfig?.title && (
                <View
                  style={[
                    stylesModalPicker.columnTitle,
                    columnConfig.titleContainerStyle,
                  ]}>
                  <CPNText
                    role="heading"
                    style={[
                      stylesModalPicker.columnTitleText,
                      columnConfig.titleTextStyle,
                    ]}>
                    {columnConfig.title}
                  </CPNText>
                </View>
              )}
              <CPNPickerSingle
                containerStyle={columnConfig?.containerStyle}
                scrollViewStyle={columnConfig?.scrollViewStyle}
                data={item.data}
                initActive={activeList[index]}
                itemHeight={itemHeight}
                itemShowNum={itemShowNum}
                onChange={_index => {
                  activeList[index] = _index;

                  for (let i = 0; i < props.dataHierarchy; i++) {
                    if (i > index) {
                      activeList[i] = 0;
                    }
                  }

                  setActiveList([...activeList]);
                }}
              />
            </View>
          );
        })}
      </View>
    );
  }

  const edgeInsets = useSafeAreaInsets();
  const boxPaddingBottom = useMemo(
    () => edgeInsets.bottom || 10,
    [edgeInsets.bottom],
  );

  function renderBtn() {
    return (
      <View
        style={[
          stylesModalPicker.btnWrapper,
          {
            height: Config.headerHeight,
            backgroundColor: Colors.backgroundPanel,
          },
        ]}>
        <TouchableOpacity onPress={props.onClose}>
          <CPNText style={stylesModalPicker.btnText}>
            {props.cancelText ?? I18n.t('Cancel')}
          </CPNText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.onClose();

            let _indexList: (number | undefined)[] = [];
            let _itemList: (ItemT | undefined)[] = [];
            for (let i = 0; i < props.dataHierarchy; i++) {
              const _index = activeList[i] ?? 0;
              const _item = dataList[i]?.data[_index];
              if (_item) {
                const _itemCopy = {..._item, children: undefined};
                delete _itemCopy.children;
                _itemList[i] = _itemCopy;
                _indexList[i] = _index;
              } else {
                _indexList[i] = undefined;
                _itemList[i] = undefined;
              }
            }

            props.onConfirm && props.onConfirm(_itemList, _indexList);
          }}>
          <CPNText style={stylesModalPicker.btnText}>
            {props.confirmText ?? I18n.t('Confirm')}
          </CPNText>
        </TouchableOpacity>
      </View>
    );
  }

  const boxHeight = useMemo(
    () => itemHeight * itemShowNum + Config.headerHeight + boxPaddingBottom,
    [boxPaddingBottom, itemHeight, itemShowNum],
  );
  const animatedValue = useRef(new Animated.Value(boxHeight)).current;
  useEffect(() => {
    if (props.show) {
      if (props.initActiveList) {
        setActiveList(props.initActiveList);
      }
      Animated.timing(animatedValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: boxHeight,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedValue, boxHeight, props.show]);

  return (
    <Modal
      visible={props.show}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={props.onClose}>
      <View style={stylesModalPicker.modal}>
        <Animated.View
          accessibilityRole="alert"
          style={{
            backgroundColor: Colors.backgroundTheme,
            paddingBottom: boxPaddingBottom,
            transform: [{translateY: animatedValue}],
          }}>
          {renderBtn()}
          {renderPicker()}
        </Animated.View>
      </View>
    </Modal>
  );
}

export type DateTimeType =
  | 'year'
  | 'month'
  | 'date'
  | 'hour'
  | 'minute'
  | 'second';
export interface DateTimeTypeObject {
  type: DateTimeType;
  text?: string;
  color?: string;
  fontSize?: number;
  backgroundColor?: string;
}
interface DateTimePickerProps {
  show: boolean;
  /** ___use memoized value___ */
  type: (DateTimeTypeObject | DateTimeType)[];
  onClose: () => void;
  initActive?: Date;
  startDate?: Date;
  endDate?: Date;
  monthLabel?: (string | undefined)[];
  onConfirm?: (dateTime: {[key in DateTimeType]: number}) => void;
  confirmText?: string;
  cancelText?: string;
}
export function CPNDateTimePicker(props: Readonly<DateTimePickerProps>) {
  I18n.useLangCode();

  const {typeString, typeObject} = useMemo(() => {
    let _typeString: DateTimeType[] = [];
    let _typeObject: DateTimeTypeObject[] = [];

    props.type.forEach(_type => {
      if (typeof _type === 'string') {
        _typeString.push(_type);
        _typeObject.push({type: _type});
      } else {
        _typeString.push(_type.type);
        _typeObject.push(_type);
      }
    });

    return {typeString: _typeString, typeObject: _typeObject};
  }, [props.type]);

  const [activeDateObj, setActiveDateObj] = useState(new Date());
  const {
    activeYear,
    activeMonth,
    activeDate,
    activeHour,
    activeMinute,
    activeSecond,
  } = useMemo(() => {
    return {
      activeYear: activeDateObj.getFullYear(),
      activeMonth: activeDateObj.getMonth(),
      activeDate: activeDateObj.getDate(),
      activeHour: activeDateObj.getHours(),
      activeMinute: activeDateObj.getMinutes(),
      activeSecond: activeDateObj.getSeconds(),
    };
  }, [activeDateObj]);

  const {yearList, yearDataList} = useMemo(() => {
    if (!typeString.includes('year')) {
      return {yearDataList: [], yearList: []};
    }
    const nowDate = new Date();
    const yearNow = nowDate.getFullYear();
    let startYear = yearNow - 20;
    if (props.startDate) {
      startYear = props.startDate.getFullYear();
    }
    let endYear = yearNow + 20;
    if (props.endDate) {
      endYear = props.endDate.getFullYear();
    }
    let _yearList = [];
    let _yearDataList: PickerData = [];
    for (let y = startYear; y <= endYear; y++) {
      _yearList.push(y);
      _yearDataList.push({value: y});
    }

    return {yearDataList: _yearDataList, yearList: _yearList};
  }, [props.endDate, props.startDate, typeString]);

  const monthLabelStr = props.monthLabel?.join(',');
  const {monthList, monthDataList} = useMemo(() => {
    if (!typeString.includes('month')) {
      return {monthDataList: [], monthList: []};
    }

    const monthLabelDefault = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
    const monthLabelList = monthLabelStr
      ? monthLabelStr.split(',')
      : monthLabelDefault;

    let startMonth = 1;
    if (props.startDate && activeYear === props.startDate.getFullYear()) {
      startMonth = props.startDate.getMonth() + 1;
    }
    let endMonth = 12;
    if (props.endDate && activeYear === props.endDate.getFullYear()) {
      endMonth = props.endDate.getMonth() + 1;
    }

    let _monthList = [];
    let _monthDataList: PickerData = [];
    for (let m = startMonth; m <= endMonth; m++) {
      _monthList.push(m);
      _monthDataList.push({
        value: m,
        label: monthLabelList[m - 1] || monthLabelDefault[m - 1],
      });
    }

    return {monthDataList: _monthDataList, monthList: _monthList};
  }, [activeYear, monthLabelStr, props.endDate, props.startDate, typeString]);

  const {dateList, dateDataList} = useMemo(() => {
    if (!typeString.includes('date')) {
      return {dateList: [], dateDataList: []};
    }
    let startDate = 1;
    if (
      props.startDate &&
      activeYear === props.startDate.getFullYear() &&
      activeMonth === props.startDate.getMonth()
    ) {
      startDate = props.startDate.getDate();
    }
    let endDate = new Date(activeYear, activeMonth + 1, 0).getDate();
    if (
      props.endDate &&
      activeYear === props.endDate.getFullYear() &&
      activeMonth === props.endDate.getMonth()
    ) {
      endDate = props.endDate.getDate();
    }

    let _dateList = [];
    let _dateDataList: PickerData = [];
    for (let d = startDate; d <= endDate; d++) {
      _dateList.push(d);
      _dateDataList.push({value: d, label: d > 9 ? `${d}` : `0${d}`});
    }

    return {dateList: _dateList, dateDataList: _dateDataList};
  }, [activeMonth, activeYear, props.endDate, props.startDate, typeString]);

  const {hourList, hourDataList} = useMemo(() => {
    if (!typeString.includes('date')) {
      return {hourList: [], hourDataList: []};
    }
    let startHour = 1;
    if (
      props.startDate &&
      activeYear === props.startDate.getFullYear() &&
      activeMonth === props.startDate.getMonth() &&
      activeDate === props.startDate.getDate()
    ) {
      startHour = props.startDate.getHours();
    }
    let endHour = 23;
    if (
      props.endDate &&
      activeYear === props.endDate.getFullYear() &&
      activeMonth === props.endDate.getMonth() &&
      activeDate === props.endDate.getDate()
    ) {
      endHour = props.endDate.getHours();
    }

    let _hourList = [];
    let _hourDataList: PickerData = [];
    for (let h = startHour; h <= endHour; h++) {
      _hourList.push(h);
      _hourDataList.push({value: h, label: h > 9 ? `${h}` : `0${h}`});
    }

    return {hourList: _hourList, hourDataList: _hourDataList};
  }, [
    activeDate,
    activeMonth,
    activeYear,
    props.endDate,
    props.startDate,
    typeString,
  ]);

  const {minuteList, minuteDataList} = useMemo(() => {
    if (!typeString.includes('minute')) {
      return {minuteList: [], minuteDataList: []};
    }
    let startMinute = 1;
    if (
      props.startDate &&
      activeYear === props.startDate.getFullYear() &&
      activeMonth === props.startDate.getMonth() &&
      activeDate === props.startDate.getDate() &&
      activeHour === props.startDate.getHours()
    ) {
      startMinute = props.startDate.getMinutes();
    }
    let endMinute = 59;
    if (
      props.endDate &&
      activeYear === props.endDate.getFullYear() &&
      activeMonth === props.endDate.getMonth() &&
      activeDate === props.endDate.getDate() &&
      activeHour === props.endDate.getHours()
    ) {
      endMinute = props.endDate.getMinutes();
    }

    let _minuteList = [];
    let _minuteDataList: PickerData = [];
    for (let m = startMinute; m <= endMinute; m++) {
      _minuteList.push(m);
      _minuteDataList.push({value: m, label: m > 9 ? `${m}` : `0${m}`});
    }

    return {minuteList: _minuteList, minuteDataList: _minuteDataList};
  }, [
    activeDate,
    activeHour,
    activeMonth,
    activeYear,
    props.endDate,
    props.startDate,
    typeString,
  ]);

  const {secondList, secondDataList} = useMemo(() => {
    if (!typeString.includes('second')) {
      return {secondList: [], secondDataList: []};
    }
    let startSecond = 1;
    if (
      props.startDate &&
      activeYear === props.startDate.getFullYear() &&
      activeMonth === props.startDate.getMonth() &&
      activeDate === props.startDate.getDate() &&
      activeHour === props.startDate.getHours() &&
      activeSecond === props.startDate.getMinutes()
    ) {
      startSecond = props.startDate.getSeconds();
    }
    let endSecond = 59;
    if (
      props.endDate &&
      activeYear === props.endDate.getFullYear() &&
      activeMonth === props.endDate.getMonth() &&
      activeDate === props.endDate.getDate() &&
      activeHour === props.endDate.getHours()
    ) {
      endSecond = props.endDate.getSeconds();
    }

    let _secondList = [];
    let _secondDataList: PickerData = [];
    for (let s = startSecond; s <= endSecond; s++) {
      _secondList.push(s);
      _secondDataList.push({value: s, label: s > 9 ? `${s}` : `0${s}`});
    }

    return {secondList: _secondList, secondDataList: _secondDataList};
  }, [
    activeDate,
    activeHour,
    activeMonth,
    activeSecond,
    activeYear,
    props.endDate,
    props.startDate,
    typeString,
  ]);

  function renderPicker() {
    return (
      <View style={[stylesModalPicker.pickerContainer]}>
        {typeObject.map((_typeObject, _index) => {
          let data: PickerData = [];
          let active = 0;

          if (_typeObject.type === 'year') {
            active = yearList.indexOf(activeYear);
            data = yearDataList;
          }
          if (_typeObject.type === 'month') {
            active = monthList.indexOf(activeMonth + 1);
            data = monthDataList;
          }
          if (_typeObject.type === 'date') {
            active = dateList.indexOf(activeDate);
            data = dateDataList;
          }
          if (_typeObject.type === 'hour') {
            active = hourList.indexOf(activeHour);
            data = hourDataList;
          }
          if (_typeObject.type === 'minute') {
            active = minuteList.indexOf(activeMinute);
            data = minuteDataList;
          }
          if (_typeObject.type === 'second') {
            active = secondList.indexOf(activeSecond);
            data = secondDataList;
          }

          return (
            <View
              key={_typeObject.type}
              style={stylesModalPicker.columnContainer}>
              <View
                style={[
                  stylesModalPicker.columnTitle,
                  !!_typeObject.backgroundColor && {
                    backgroundColor: _typeObject.backgroundColor,
                  },
                ]}>
                <CPNText
                  style={[
                    stylesModalPicker.columnTitleText,
                    !!_typeObject.color && {color: _typeObject.color},
                    !!_typeObject.fontSize && {fontSize: _typeObject.fontSize},
                  ]}>
                  {_typeObject.text ?? toTitleCase(_typeObject.type)}
                </CPNText>
              </View>
              <View style={{width: 54}}>
                <CPNPickerSingle
                  data={data}
                  initActive={active}
                  onChange={_index2 => {
                    if (_typeObject.type === 'year') {
                      setActiveDateObj(
                        new Date(
                          yearList[_index2],
                          activeMonth,
                          activeDate,
                          activeHour,
                          activeMinute,
                          activeSecond,
                        ),
                      );
                    }
                    if (_typeObject.type === 'month') {
                      setActiveDateObj(
                        new Date(
                          activeYear,
                          monthList[_index2] - 1,
                          activeDate,
                          activeHour,
                          activeMinute,
                          activeSecond,
                        ),
                      );
                    }
                    if (_typeObject.type === 'date') {
                      setActiveDateObj(
                        new Date(
                          activeYear,
                          activeMonth,
                          dateList[_index2],
                          activeHour,
                          activeMinute,
                          activeSecond,
                        ),
                      );
                    }
                    if (_typeObject.type === 'hour') {
                      setActiveDateObj(
                        new Date(
                          activeYear,
                          activeMonth,
                          activeDate,
                          hourList[_index2],
                          activeMinute,
                          activeSecond,
                        ),
                      );
                    }
                    if (_typeObject.type === 'minute') {
                      setActiveDateObj(
                        new Date(
                          activeYear,
                          activeMonth,
                          activeDate,
                          activeHour,
                          minuteList[_index2],
                          activeSecond,
                        ),
                      );
                    }
                    if (_typeObject.type === 'second') {
                      setActiveDateObj(
                        new Date(
                          activeYear,
                          activeMonth,
                          activeDate,
                          activeHour,
                          activeMinute,
                          secondList[_index2],
                        ),
                      );
                    }
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  function renderBtn() {
    return (
      <View
        style={[
          stylesModalPicker.btnWrapper,
          {
            height: Config.headerHeight,
            backgroundColor: Colors.backgroundPanel,
          },
        ]}>
        <TouchableOpacity onPress={props.onClose}>
          <CPNText style={stylesModalPicker.btnText}>
            {props.cancelText ?? I18n.t('Cancel')}
          </CPNText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.onClose();
            props.onConfirm &&
              props.onConfirm({
                year: activeYear,
                month: activeMonth + 1,
                date: activeDate,
                hour: activeHour,
                minute: activeMinute,
                second: activeSecond,
              });
          }}>
          <CPNText style={stylesModalPicker.btnText}>
            {props.confirmText ?? I18n.t('Confirm')}
          </CPNText>
        </TouchableOpacity>
      </View>
    );
  }

  const edgeInsets = useSafeAreaInsets();
  const boxPaddingBottom = useMemo(
    () => edgeInsets.bottom || 10,
    [edgeInsets.bottom],
  );
  const boxHeight = useMemo(
    () =>
      Config.itemHeight * Config.itemShowNum +
      Config.headerHeight +
      boxPaddingBottom,
    [boxPaddingBottom],
  );
  const animatedValue = useRef(new Animated.Value(boxHeight)).current;
  useEffect(() => {
    if (props.show) {
      if (props.initActive) {
        setActiveDateObj(props.initActive);
      }
      Animated.timing(animatedValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: boxHeight,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedValue, boxHeight, props.show]);

  return (
    <Modal
      visible={props.show}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={props.onClose}>
      <View style={stylesModalPicker.modal}>
        <Animated.View
          accessibilityRole="alert"
          style={{
            backgroundColor: Colors.backgroundTheme,
            paddingBottom: boxPaddingBottom,
            transform: [{translateY: animatedValue}],
          }}>
          {renderBtn()}
          {renderPicker()}
        </Animated.View>
      </View>
    </Modal>
  );
}
