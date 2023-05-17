import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {I18n} from '@/assets/I18n';
import {
  CPNAlert,
  CPNButton,
  CPNIonicons,
  CPNPageModal,
  CPNPageView,
  CPNText,
  IONName,
  CPNCellGroup,
  CPNCell,
  CPNInput,
  CPNFormItem,
} from '@/components/base';
import {
  ColorItem,
  dbDeleteColor,
  dbGetColors,
  dbGetColorsUsedIds,
  dbSetColor,
} from '@/database';
import {TouchableOpacity, View} from 'react-native';
import {getRandomStrMD5} from '@/utils/tools';
import {StyleGet} from '@/configs/styles';
import {Colors} from '@/configs/colors';
import {ShowTabType, CPNUsedTab} from '@/components/CPNUsedTab';

export function ColorManagementPage() {
  const [ColorsList, ColorsListSet] = useState<ColorItem[]>([]);
  const [ColorsUsedIds, ColorsUsedIdsSet] = useState<string[]>([]);
  const getDBColors = useCallback(async () => {
    const res = await dbGetColors();
    ColorsListSet(res);
    const ids = await dbGetColorsUsedIds();
    ColorsUsedIdsSet(ids);
  }, []);
  useEffect(() => {
    getDBColors();
  }, [getDBColors]);

  const [tabActive, tabActiveSet] = useState<ShowTabType>(ShowTabType.All);
  function renderTab() {
    return (
      <View style={{paddingBottom: 16}}>
        <CPNUsedTab value={tabActive} onChange={_type => tabActiveSet(_type)} />
      </View>
    );
  }

  const dataShowMemo = useMemo(() => {
    if (tabActive === ShowTabType.NotUsed) {
      return ColorsList.filter(item => !ColorsUsedIds.includes(item.value));
    }
    if (tabActive === ShowTabType.Used) {
      return ColorsList.filter(item => ColorsUsedIds.includes(item.value));
    }

    return ColorsList;
  }, [ColorsList, ColorsUsedIds, tabActive]);

  const [showDetailsModal, showDetailsModalSet] = useState(false);
  const [details, detailsSet] = useState<Partial<ColorItem>>({});
  const detailsRef = useRef<Partial<ColorItem>>({});
  const [detailsError, detailsErrorSet] = useState<ErrorItem<ColorItem>>({});
  function renderDetailsModal() {
    return (
      <CPNPageModal.View
        gestureEnabled
        show={showDetailsModal}
        onClose={() => showDetailsModalSet(false)}>
        <CPNPageView
          title={
            detailsRef.current.value
              ? I18n.formatString(I18n.EditColor, detailsRef.current.name || '')
              : I18n.AddColor
          }
          scrollEnabled={false}
          headerBackgroundColor={detailsRef.current.value}
          safeArea={false}
          leftIconType="close"
          onPressLeftIcon={() => showDetailsModalSet(false)}
          rightIcon={
            !!detailsRef.current.value && (
              <TouchableOpacity
                onPress={async () => {
                  CPNAlert.open({
                    message: I18n.formatString(
                      I18n.DeleteConfirm,
                      detailsRef.current.name || '',
                    ),
                    buttons: [
                      {text: I18n.Cancel},
                      {
                        text: I18n.Confirm,
                        async onPress() {
                          if (detailsRef.current.value) {
                            dbDeleteColor(detailsRef.current.value);
                            await getDBColors();
                            showDetailsModalSet(false);
                          }
                        },
                      },
                    ],
                  });
                }}>
                <CPNIonicons name={IONName.Delete} />
              </TouchableOpacity>
            )
          }>
          <View style={{padding: 20}}>
            <CPNFormItem
              style={{paddingBottom: 10}}
              title={I18n.ColorName}
              hasError={!!detailsError.name}
              errorText={detailsError.name}>
              <CPNInput
                value={details.name}
                onChangeText={name => {
                  detailsSet({...details, name});
                  detailsErrorSet({...detailsError, name: ''});
                }}
              />
            </CPNFormItem>

            <CPNFormItem
              style={{paddingBottom: 20}}
              title={
                <View
                  style={[
                    StyleGet.cellTitleView(),
                    {flexDirection: 'row', alignItems: 'center'},
                  ]}>
                  <CPNText
                    style={{color: detailsRef.current.value || Colors.theme}}>
                    {I18n.ColorValue}
                  </CPNText>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: details.value,
                      marginLeft: 4,
                    }}
                  />
                </View>
              }
              description={I18n.ColorValueDesc}
              hasError={!!detailsError.value}
              errorText={detailsError.value}>
              <CPNInput
                value={details.value}
                editable={!detailsRef.current.value}
                onChangeText={value => {
                  detailsSet({...details, value});
                  detailsErrorSet({...detailsError, value: ''});
                }}
              />
            </CPNFormItem>

            <CPNButton
              children={I18n.Submit}
              onPress={async () => {
                const _detailsError: ErrorItem<ColorItem> = {};
                if (!details.name) {
                  _detailsError.name = I18n.ColorNameError1;
                }

                if (!details.value) {
                  _detailsError.value = I18n.ColorValueError1;
                } else if (
                  !details.value.startsWith('#') &&
                  !details.value.startsWith('rgb')
                ) {
                  _detailsError.value = I18n.ColorValueError2;
                } else if (
                  details.value &&
                  ColorsList.map(item => item.value).includes(details.value)
                ) {
                  _detailsError.value = I18n.ColorValueError3;
                }

                const errorList = Object.values(_detailsError).map(
                  _item => !!_item,
                );
                if (errorList.includes(true)) {
                  detailsErrorSet(_detailsError);
                  return;
                }

                if (!details.value) {
                  details.value = getRandomStrMD5();
                }
                await dbSetColor(details);
                await getDBColors();
                showDetailsModalSet(false);
              }}
            />
          </View>
        </CPNPageView>
      </CPNPageModal.View>
    );
  }

  return (
    <>
      <CPNPageView title={I18n.ColorManagement}>
        <View style={{padding: 20}}>
          {renderTab()}
          <CPNCellGroup>
            {dataShowMemo.map(item => (
              <CPNCell
                key={item.value}
                title={
                  <>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: item.value,
                        marginRight: 6,
                      }}
                    />
                    <CPNText>{item.name}</CPNText>
                  </>
                }
                value={item.value}
                onPress={
                  ColorsUsedIds.includes(item.value)
                    ? undefined
                    : () => {
                        detailsSet(item);
                        detailsErrorSet({});
                        detailsRef.current = item;
                        showDetailsModalSet(true);
                      }
                }
              />
            ))}
            <TouchableOpacity
              style={[
                StyleGet.cellView(),
                {
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              onPress={() => {
                detailsSet({});
                detailsErrorSet({});
                detailsRef.current = {};
                showDetailsModalSet(true);
              }}>
              <CPNIonicons name={IONName.Add} color={Colors.theme} />
            </TouchableOpacity>
          </CPNCellGroup>
        </View>
      </CPNPageView>
      {renderDetailsModal()}
    </>
  );
}
