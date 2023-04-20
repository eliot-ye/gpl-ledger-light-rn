import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {dbDeleteAssetType, dbGetAssetTypes, dbSetAssetType} from '@/database';
import {AssetTypeItem} from '@/database/assetType/schema';
import {TouchableOpacity, View} from 'react-native';
import {getRandomStrMD5} from '@/utils/tools';
import {StyleGet} from '@/configs/styles';
import {Colors} from '@/configs/colors';

export function AssetTypeManagementPage() {
  const [AssetTypeList, AssetTypeListSet] = useState<AssetTypeItem[]>([]);
  const getDBAssetTypes = useCallback(async () => {
    const res = await dbGetAssetTypes();
    AssetTypeListSet(res);
  }, []);
  useEffect(() => {
    getDBAssetTypes();
  }, [getDBAssetTypes]);

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
          titleText={
            detailsRef.current.id
              ? (I18n.formatString(
                  I18n.EditAssetType,
                  detailsRef.current.name || '',
                ) as string)
              : I18n.AddAssetType
          }
          scrollEnabled={false}
          safeArea={false}
          leftIconType="close"
          onPressLeftIcon={() => showDetailsModalSet(false)}
          rightIcon={
            !!detailsRef.current.id && (
              <TouchableOpacity
                onPress={async () => {
                  // showDeleteAlertSet(true);
                  CPNAlert.open({
                    message: I18n.formatString(
                      I18n.DeleteConfirm,
                      detailsRef.current.name || '',
                    ) as string,
                    buttons: [
                      {text: I18n.Cancel},
                      {
                        text: I18n.Confirm,
                        async onPress() {
                          if (detailsRef.current.id) {
                            dbDeleteAssetType(detailsRef.current.id);
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
              text={I18n.Submit}
              onPress={async () => {
                const _detailsError: ErrorItem<AssetTypeItem> = {};
                if (!details.name) {
                  _detailsError.name = I18n.AssetTypeNameError1;
                }

                if (details.isAvailableAssets === undefined) {
                  _detailsError.isAvailableAssets = I18n.AssetTypeError;
                }

                const errorList = Object.values(_detailsError).map(
                  _item => !!_item,
                );
                if (errorList.includes(true)) {
                  detailsErrorSet(_detailsError);
                  return;
                }

                if (!details.id) {
                  details.id = getRandomStrMD5();
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
      <CPNPageView titleText={I18n.AssetTypeManagement}>
        <View style={{padding: 20}}>
          <CPNCellGroup>
            {AssetTypeList.map(item => (
              <CPNCell
                key={item.id}
                title={item.name}
                value={
                  item.isAvailableAssets
                    ? I18n.AvailableAssets
                    : I18n.UnavailableAssets
                }
                onPress={() => {
                  detailsSet(item);
                  detailsErrorSet({});
                  detailsRef.current = item;
                  showDetailsModalSet(true);
                }}
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
