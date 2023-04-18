import React, {useEffect, useMemo, useState} from 'react';
import {I18n} from '@/assets/I18n';
import {CNPFormItem, CNPInput} from '@/components';
import {
  CPNPageView,
  CPNIonicons,
  IONName,
  CPNButton,
  CPNDropdown,
  CPNAlert,
  CPNText,
} from '@/components/base';
import {getRandomStrMD5} from '@/utils/tools';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {PageProps} from '../Router';
import {LedgerItem} from '@/database/ledger/schema';
import {dbGetAssetTypes, dbGetColors} from '@/database';
import {AssetTypeItem} from '@/database/assetType/schema';
import {ColorItem} from '@/database/color/schema';
import {dbSetLedger} from '@/database/ledger/handle';
import {Colors} from '@/configs/colors';
import {StoreHomePage} from '@/store';

export function LedgerDetailsPage() {
  const navigation =
    useNavigation<PageProps<'LedgerDetailsPage'>['navigation']>();
  const route = useRoute<PageProps<'LedgerDetailsPage'>['route']>();

  const HomePageDispatch = StoreHomePage.useDispatch();
  const HomePageState = StoreHomePage.useState();

  const [details, detailsSet] = useState<Partial<LedgerItem>>(
    route.params || {},
  );
  const [detailsError, detailsErrorSet] = useState<ErrorItem<LedgerItem>>({});

  const [assetTypeList, assetTypeListSet] = useState<AssetTypeItem[]>([]);
  useEffect(() => {
    dbGetAssetTypes().then(res => {
      assetTypeListSet(res);
    });
  }, [assetTypeListSet]);

  const [colorsList, colorsListSet] = useState<ColorItem[]>([]);
  useEffect(() => {
    dbGetColors().then(res => {
      colorsListSet(res);
    });
  }, []);

  return (
    <CPNPageView
      titleText={
        route.params?.id
          ? (I18n.formatString(
              I18n.EditAsset,
              route.params.name || '',
            ) as string)
          : I18n.AddAsset
      }
      rightIcon={
        !!route.params?.id && (
          <TouchableOpacity
            onPress={async () => {
              CPNAlert.open({
                message: I18n.formatString(
                  I18n.DeleteConfirm,
                  route.params?.name || '',
                ) as string,
              });
              // showDeleteAlertSet(true);
            }}>
            <CPNIonicons name={IONName.Delete} />
          </TouchableOpacity>
        )
      }>
      <View style={{padding: 20}}>
        <CNPFormItem
          style={{paddingBottom: 20}}
          title={I18n.AssetName}
          hasError={!!detailsError.name}
          errorText={detailsError.name}>
          <CNPInput
            value={details.name}
            onChangeText={name => {
              detailsSet({...details, name});
              detailsErrorSet({...detailsError, name: ''});
            }}
          />
        </CNPFormItem>

        <CNPFormItem
          style={{paddingBottom: 20}}
          title={I18n.AssetType}
          hasError={!!detailsError.assetType}
          errorText={detailsError.assetType}>
          <CPNDropdown
            data={useMemo(
              () =>
                assetTypeList.map(item => ({
                  ...item,
                  label: item.name,
                  value: item.id,
                })),
              [assetTypeList],
            )}
            checked={details.assetType?.id}
            onSelect={item => {
              detailsSet({...details, assetType: item});
              detailsErrorSet({...detailsError, assetType: ''});
            }}
          />
        </CNPFormItem>

        <CNPFormItem
          style={{paddingBottom: 20}}
          title={
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CPNText
                style={{
                  color: detailsError.color ? Colors.fail : Colors.theme,
                }}>
                {I18n.Color}
              </CPNText>
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: details.color?.value,
                  marginLeft: 4,
                }}
              />
            </View>
          }
          hasError={!!detailsError.color}
          errorText={detailsError.color}>
          <CPNDropdown
            data={useMemo(
              () => colorsList.map(item => ({...item, label: item.name})),
              [colorsList],
            )}
            checked={details.color?.value}
            onSelect={item => {
              detailsSet({...details, color: item});
              detailsErrorSet({...detailsError, color: ''});
            }}
          />
        </CNPFormItem>

        <CNPFormItem
          style={{paddingBottom: 20}}
          title={I18n.AmountMoney}
          hasError={!!detailsError.amountMoney}
          errorText={detailsError.amountMoney}>
          <CNPInput
            value={
              details.amountMoney === undefined
                ? undefined
                : String(details.amountMoney)
            }
            onChangeText={value => {
              const amountMoney = Number(value);
              if (Number.isNaN(amountMoney)) {
                detailsErrorSet({
                  ...detailsError,
                  amountMoney: I18n.AmountMoneyError1,
                });
              } else {
                detailsSet({...details, amountMoney});
                detailsErrorSet({...detailsError, amountMoney: ''});
              }
            }}
          />
        </CNPFormItem>

        <CPNButton
          text={I18n.Submit}
          onPress={async () => {
            const _detailsError: ErrorItem<LedgerItem> = {};
            if (!details.name) {
              _detailsError.name = I18n.AssetNameError1;
            }
            if (!details.assetType) {
              _detailsError.assetType = I18n.AssetTypeError;
            }
            if (!details.color) {
              _detailsError.color = I18n.ColorError;
            }
            if (details.amountMoney === undefined) {
              _detailsError.amountMoney = I18n.AmountMoneyError1;
            }

            if (
              Object.values(_detailsError)
                .map(_item => !!_item)
                .includes(true)
            ) {
              detailsErrorSet(_detailsError);
              return;
            }

            if (!details.id) {
              details.id = getRandomStrMD5();
            }
            if (route.params?.amountMoney !== details.amountMoney) {
              if (!details.history) {
                details.history = [
                  {
                    date: new Date().getTime(),
                    amountMoney: details.amountMoney || 0,
                  },
                ];
              } else {
                details.history.push({
                  date: new Date().getTime(),
                  amountMoney: details.amountMoney || 0,
                });
              }
            }
            if (
              route.params?.name !== details.name ||
              route.params?.amountMoney !== details.amountMoney ||
              route.params?.assetType.id !== details.assetType?.id ||
              route.params?.color.id !== details.color?.id
            ) {
              await dbSetLedger(details);
              HomePageDispatch('updateCount', HomePageState.updateCount + 1);
            }
            navigation.navigate('Tabbar', {screen: 'HomePage'});
          }}
        />
      </View>
    </CPNPageView>
  );
}
