import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {I18n} from '@/assets/I18n';
import {
  CPNAlert,
  CPNButton,
  CPNCheckbox,
  CPNIonicons,
  CPNPageModal,
  CPNPageView,
  IONName,
  CPNCellGroup,
  CPNCell,
  CPNInput,
  CPNFormItem,
} from '@/components/base';
import {
  AssetTypeItem,
  dbDeleteAssetType,
  dbGetAssetTypes,
  dbGetAssetTypesUsedIds,
  dbSetAssetType,
} from '@/database';
import {TouchableOpacity, View} from 'react-native';
import {StyleGet} from '@/configs/styles';
import {Colors} from '@/configs/colors';
import {CPNUsedTab, ShowTabType} from '@/components/CPNUsedTab';

export function AssetTypeManagementPage() {
  const [AssetTypeList, AssetTypeListSet] = useState<AssetTypeItem[]>([]);
  const [AssetTypeUsedIds, AssetTypeUsedIdsSet] = useState<string[]>([]);
  const getDBAssetTypes = useCallback(async () => {
    const res = await dbGetAssetTypes();
    AssetTypeListSet(res);
    const ids = await dbGetAssetTypesUsedIds();
    AssetTypeUsedIdsSet(ids);
  }, []);
  useEffect(() => {
    getDBAssetTypes();
  }, [getDBAssetTypes]);

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
      return AssetTypeList.filter(
        item => !AssetTypeUsedIds.includes(item.symbol),
      );
    }
    if (tabActive === ShowTabType.Used) {
      return AssetTypeList.filter(item =>
        AssetTypeUsedIds.includes(item.symbol),
      );
    }

    return AssetTypeList;
  }, [AssetTypeList, AssetTypeUsedIds, tabActive]);

  const [showDetailsModal, showDetailsModalSet] = useState(false);
  const [details, detailsSet] = useState<Partial<AssetTypeItem>>({});
  const detailsRef = useRef<Partial<AssetTypeItem>>({});
  const [detailsError, detailsErrorSet] = useState<ErrorItem<AssetTypeItem>>(
    {},
  );
  function renderDetailsModal() {
    return (
      <CPNPageModal.View
        gestureEnabled
        show={showDetailsModal}
        onClose={() => showDetailsModalSet(false)}>
        <CPNPageView
          title={
            detailsRef.current.symbol
              ? I18n.formatString(
                  I18n.EditAssetType,
                  detailsRef.current.name || '',
                )
              : I18n.AddAssetType
          }
          scrollEnabled={false}
          safeArea={false}
          leftIconType="close"
          onPressLeftIcon={() => showDetailsModalSet(false)}
          rightIcon={
            !!detailsRef.current.symbol && (
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
                          if (detailsRef.current.symbol) {
                            dbDeleteAssetType(detailsRef.current.symbol);
                            await getDBAssetTypes();
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
              style={{paddingBottom: 20}}
              title={I18n.AssetTypeName}
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
              title={I18n.Symbol}
              description={I18n.SymbolDesc}
              hasError={!!detailsError.symbol}
              errorText={detailsError.symbol}>
              <CPNInput
                value={details.symbol}
                editable={!detailsRef.current.symbol}
                onChangeText={symbol => {
                  detailsSet({...details, symbol});
                  detailsErrorSet({...detailsError, symbol: ''});
                }}
              />
            </CPNFormItem>

            <CPNFormItem
              style={{paddingBottom: 30}}
              title={I18n.AssetType}
              hasError={!!detailsError.isAvailableAssets}
              errorText={detailsError.isAvailableAssets}>
              <View style={{flexDirection: 'row'}}>
                <CPNCheckbox
                  label={I18n.AvailableAssets}
                  checked={details.isAvailableAssets === true}
                  isRadio
                  onPress={() => {
                    detailsSet({...details, isAvailableAssets: true});
                    detailsErrorSet({...detailsError, isAvailableAssets: ''});
                  }}
                />
                <CPNCheckbox
                  checked={details.isAvailableAssets === false}
                  label={I18n.UnavailableAssets}
                  isRadio
                  onPress={() => {
                    detailsSet({...details, isAvailableAssets: false});
                    detailsErrorSet({...detailsError, isAvailableAssets: ''});
                  }}
                />
              </View>
            </CPNFormItem>

            <CPNButton
              children={I18n.Submit}
              onPress={async () => {
                const _detailsError: ErrorItem<AssetTypeItem> = {};
                if (!details.name) {
                  _detailsError.name = I18n.AssetTypeNameError1;
                }

                if (details.isAvailableAssets === undefined) {
                  _detailsError.isAvailableAssets = I18n.AssetTypeError;
                }

                if (!details.symbol) {
                  _detailsError.symbol = I18n.SymbolError;
                } else if (
                  details.symbol &&
                  AssetTypeList.map(item => item.symbol).includes(
                    details.symbol,
                  )
                ) {
                  _detailsError.symbol = I18n.SymbolError2;
                }

                const errorList = Object.values(_detailsError).map(
                  _item => !!_item,
                );
                if (errorList.includes(true)) {
                  detailsErrorSet(_detailsError);
                  return;
                }

                await dbSetAssetType(details);
                await getDBAssetTypes();
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
      <CPNPageView title={I18n.AssetTypeManagement}>
        <View style={{padding: 20}}>
          {renderTab()}
          <CPNCellGroup>
            {dataShowMemo.map(item => (
              <CPNCell
                key={item.symbol}
                title={item.name}
                value={
                  item.isAvailableAssets
                    ? I18n.AvailableAssets
                    : I18n.UnavailableAssets
                }
                onPress={
                  AssetTypeUsedIds.includes(item.symbol)
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
