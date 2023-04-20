import React, {useEffect, useMemo, useState} from 'react';
import {I18n} from '@/assets/I18n';
import {
  CPNPageView,
  CPNIonicons,
  IONName,
  CPNButton,
  CPNDropdown,
  CPNAlert,
  CPNText,
  CPNFormItem,
  CPNInput,
} from '@/components/base';
import {getRandomStrMD5} from '@/utils/tools';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {PageProps} from '../Router';
import {LedgerItem} from '@/database/ledger/schema';
import {dbGetAssetTypes, dbGetColors, dbGetCurrency} from '@/database';
import {AssetTypeItem} from '@/database/assetType/schema';
import {ColorItem} from '@/database/color/schema';
import {dbDeleteLedger, dbSetLedger} from '@/database/ledger/handle';
import {Colors} from '@/configs/colors';
import {StoreHomePage} from '@/store';
import {CurrencyItem} from '@/database/currency/schema';

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

  const [currencyList, currencyListSet] = useState<CurrencyItem[]>([]);
  useEffect(() => {
    dbGetCurrency().then(res => {
      currencyListSet(res);
    });
  }, []);

  const [colorsList, colorsListSet] = useState<ColorItem[]>([]);
  useEffect(() => {
    dbGetColors().then(res => {
      colorsListSet(res);
    });
  }, []);

  return (
    <CPNPageView
      title={
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
                buttons: [
                  {text: I18n.Cancel},
                  {
                    text: I18n.Confirm,
                    async onPress() {
                      if (route.params?.id) {
                        dbDeleteLedger(route.params?.id);
                        HomePageDispatch(
                          'updateCount',
                          HomePageState.updateCount + 1,
                        );
                        navigation.goBack();
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
          title={I18n.AssetName}
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
          title={I18n.AssetType}
          hasError={!!detailsError.assetType}
          errorText={detailsError.assetType}>
          <CPNDropdown
            data={useMemo(
              () =>
                assetTypeList.map(item => ({
                  ...item,
                  label: `${item.name}(${
                    item.isAvailableAssets
                      ? I18n.AvailableAssets
                      : I18n.UnavailableAssets
                  })`,
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
        </CPNFormItem>

        <CPNFormItem
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
            renderItemContent={item => (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CPNText>{item.label}</CPNText>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: item.value,
                    marginLeft: 6,
                  }}
                />
              </View>
            )}
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
        </CPNFormItem>

        <CPNFormItem
          style={{paddingBottom: 20}}
          title={I18n.Currency}
          hasError={!!detailsError.currency}
          errorText={detailsError.currency}>
          <CPNDropdown
            data={useMemo(
              () =>
                currencyList.map(item => ({
                  ...item,
                  label: `${item.name}(${item.abbreviation})`,
                  value: item.id,
                })),
              [currencyList],
            )}
            checked={details.currency?.id}
            onSelect={item => {
              detailsSet({...details, currency: item});
              detailsErrorSet({...detailsError, currency: ''});
            }}
          />
        </CPNFormItem>

        <CPNFormItem
          style={{paddingBottom: 20}}
          title={I18n.AmountMoney}
          hasError={!!detailsError.amountMoney}
          errorText={detailsError.amountMoney}>
          <CPNInput
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
        </CPNFormItem>

        <CPNButton
          children={I18n.Submit}
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
            if (!details.currency) {
              _detailsError.currency = I18n.CurrencyError;
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
            navigation.goBack();
          }}
        />
      </View>
    </CPNPageView>
  );
}
