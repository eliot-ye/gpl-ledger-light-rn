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
  HeaderConfigs,
} from '@/components/base';
import {getRandomStrMD5} from '@/utils/tools';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {PageProps} from '../Router';
import {
  AssetTypeItem,
  LedgerItem,
  ColorItem,
  CurrencyItem,
  dbGetAssetTypes,
  dbGetColors,
  dbGetCurrency,
  dbDeleteLedger,
  dbSetLedger,
  dbGetColorsUsedIds,
} from '@/database';
import {Colors} from '@/assets/colors';
import {formatDateMonth} from '@/utils/dateFn';
import {LineChart} from 'react-native-chart-kit';
import {LineChartData} from 'react-native-chart-kit/dist/line-chart/LineChart';
import {useDimensions} from '@/utils/dimensions';
import {CPNCurrencyView} from '@/components/CPNCurrencyView';
import {StyleGet} from '@/assets/styles';
import {ErrorItem} from 'types/global';

export function LedgerDetailsPage() {
  const navigation =
    useNavigation<PageProps<'LedgerDetailsPage'>['navigation']>();
  const route = useRoute<PageProps<'LedgerDetailsPage'>['route']>();
  I18n.useLangCode();

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
  const [colorsUsedIds, colorsUsedIdsSet] = useState<string[]>([]);
  useEffect(() => {
    dbGetColors().then(res => {
      colorsListSet(res);
    });
    dbGetColorsUsedIds().then(res => {
      colorsUsedIdsSet(res);
    });
  }, []);

  const {width} = useDimensions('window');

  const ChartData = useMemo<LineChartData>(() => {
    if (!details.history) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const historyList = details.history.filter(
      (_item, _index) => _index >= (details.history?.length || 0) - 8,
    );

    return {
      labels: historyList.map(item => formatDateMonth(item.date)),
      datasets: [
        {
          data: historyList.map(item => item.amountMoney),
        },
      ],
    };
  }, [details.history]);
  function renderChart() {
    if (!details.history || details.history.length < 2) {
      return;
    }

    return (
      <View>
        <LineChart
          data={ChartData}
          width={width}
          height={220}
          yAxisLabel={route.params?.currency.symbol}
          chartConfig={{
            backgroundGradientFrom: route.params?.color.value,
            backgroundGradientTo: route.params?.color.value,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            decimalPlaces: 0,
            style: {
              borderRadius: 16,
              padding: 10,
            },
          }}
          bezier
        />
      </View>
    );
  }

  return (
    <CPNPageView
      alwaysBounceVertical={false}
      theme={route.params?.color.value}
      title={
        route.params?.id
          ? I18n.f(I18n.t('EditAsset'), route.params.name || '')
          : I18n.t('AddAsset')
      }
      rightIcon={
        !!route.params?.id && (
          <TouchableOpacity
            style={{paddingRight: HeaderConfigs.paddingHorizontal}}
            onPress={async () => {
              await CPNAlert.confirm(
                '',
                I18n.f(I18n.t('DeleteConfirm'), route.params?.name || ''),
              );
              if (route.params?.id) {
                dbDeleteLedger(route.params?.id);
                navigation.goBack();
              }
            }}>
            <CPNIonicons name={IONName.Delete} />
          </TouchableOpacity>
        )
      }>
      {renderChart()}
      <View style={{padding: 20}}>
        <CPNFormItem
          style={{paddingBottom: 20}}
          title={
            route.params ? (
              <>
                <CPNText style={{color: route.params.color.value}}>
                  {I18n.t('AssetName')}:{' '}
                </CPNText>
                <CPNText>{route.params.name}</CPNText>
              </>
            ) : (
              <CPNText
                style={{
                  color: Colors.theme,
                }}>
                {I18n.t('AssetName')}
              </CPNText>
            )
          }
          hasError={!!detailsError.name}
          errorText={detailsError.name}>
          <CPNInput
            placeholder={I18n.t('PlaceholderInput', I18n.t('AssetName'))}
            value={details.name}
            onChangeText={name => {
              detailsSet({...details, name});
              detailsErrorSet({...detailsError, name: ''});
            }}
          />
        </CPNFormItem>

        {!route.params?.id && (
          <CPNFormItem
            style={{paddingBottom: 20}}
            title={I18n.t('AssetType')}
            description={I18n.t('CreateDescription1')}
            hasError={!!detailsError.assetType}
            errorText={detailsError.assetType}>
            <CPNDropdown
              data={useMemo(
                () =>
                  assetTypeList.map(item => ({
                    ...item,
                    label: `(${
                      item.isAvailableAssets
                        ? I18n.t('AvailableAssets')
                        : I18n.t('UnavailableAssets')
                    })${item.name}`,
                    value: item.symbol,
                  })),
                [assetTypeList],
              )}
              checked={details.assetType?.symbol}
              onChange={item => {
                detailsSet({...details, assetType: item});
                detailsErrorSet({...detailsError, assetType: ''});
              }}
            />
          </CPNFormItem>
        )}

        <CPNFormItem
          style={{paddingBottom: 20}}
          title={
            route.params ? (
              <>
                <CPNText style={{color: route.params.color.value}}>
                  {I18n.t('Color')}:{' '}
                </CPNText>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: route.params.color.value,
                  }}
                />
              </>
            ) : (
              <CPNText style={{color: Colors.theme}}>{I18n.t('Color')}</CPNText>
            )
          }
          hasError={!!detailsError.color}
          errorText={detailsError.color}>
          <CPNDropdown
            renderItemContent={item => (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: item.value,
                    marginLeft: 6,
                    marginRight: 10,
                  }}
                />
                <CPNText>{item.label}</CPNText>
                {colorsUsedIds.includes(item.value) && (
                  <CPNText
                    style={{color: Colors.fontPlaceholder, fontSize: 12}}>
                    (
                    {route.params?.color.value === item.value
                      ? I18n.t('InUse')
                      : I18n.t('Used')}
                    )
                  </CPNText>
                )}
              </View>
            )}
            renderCellContent={item => {
              if (!item || !item.value) {
                return (
                  <CPNText
                    style={[
                      StyleGet.title('h4'),
                      {color: Colors.fontPlaceholder},
                    ]}>
                    {I18n.t('PlaceholderSelect', I18n.t('Color'))}
                  </CPNText>
                );
              }
              return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: item.value,
                      marginLeft: 6,
                      marginRight: 10,
                    }}
                  />
                  <CPNText>{item.label}</CPNText>
                </View>
              );
            }}
            data={useMemo(
              () => colorsList.map(item => ({...item, label: item.name})),
              [colorsList],
            )}
            checked={details.color?.value}
            onChange={item => {
              detailsSet({...details, color: item});
              detailsErrorSet({...detailsError, color: ''});
            }}
          />
        </CPNFormItem>

        {!route.params?.id && (
          <CPNFormItem
            style={{paddingBottom: 20}}
            title={I18n.t('Currency')}
            description={I18n.t('CreateDescription1')}
            hasError={!!detailsError.currency}
            errorText={detailsError.currency}>
            <CPNDropdown
              data={useMemo(
                () =>
                  currencyList.map(item => ({
                    ...item,
                    label: `(${item.abbreviation})${item.name}`,
                    value: item.symbol,
                  })),
                [currencyList],
              )}
              checked={details.currency?.symbol}
              onChange={item => {
                detailsSet({...details, currency: item});
                detailsErrorSet({...detailsError, currency: ''});
              }}
            />
          </CPNFormItem>
        )}

        <CPNFormItem
          style={{paddingBottom: 20}}
          title={
            route.params ? (
              <>
                <CPNText style={{color: route.params.color.value}}>
                  {I18n.t('AmountMoney')}:
                </CPNText>
                <CPNCurrencyView
                  symbol={route.params.currency.symbol}
                  amount={route.params.amountMoney}
                />
              </>
            ) : (
              <CPNText style={{color: Colors.theme}}>
                {I18n.t('AmountMoney')}
              </CPNText>
            )
          }
          hasError={!!detailsError.amountMoney}
          errorText={detailsError.amountMoney}>
          <CPNInput
            placeholder={I18n.t('PlaceholderInput', I18n.t('AmountMoney'))}
            keyboardType="numeric"
            value={
              details.amountMoney === undefined
                ? undefined
                : String(details.amountMoney)
            }
            onChangeText={value => {
              if (!value) {
                detailsSet({...details, amountMoney: undefined});
                detailsErrorSet({...detailsError, amountMoney: ''});
                return;
              }
              const amountMoney = parseFloat(value);
              if (Number.isNaN(amountMoney)) {
                detailsErrorSet({
                  ...detailsError,
                  amountMoney: I18n.t('AmountMoneyError1'),
                });
              } else {
                detailsSet({...details, amountMoney});
                detailsErrorSet({...detailsError, amountMoney: ''});
              }
            }}
          />
        </CPNFormItem>

        <CPNButton
          children={I18n.t('Submit')}
          onPress={async () => {
            const _detailsError: ErrorItem<LedgerItem> = {};
            if (!details.name) {
              _detailsError.name = I18n.t('AssetNameError1');
            }
            if (!details.assetType) {
              _detailsError.assetType = I18n.t('AssetTypeError');
            }
            if (!details.color) {
              _detailsError.color = I18n.t('ColorError');
            }
            if (!details.currency) {
              _detailsError.currency = I18n.t('CurrencyError');
            }
            if (details.amountMoney === undefined) {
              _detailsError.amountMoney = I18n.t('AmountMoneyError1');
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
              route.params?.assetType.symbol !== details.assetType?.symbol ||
              route.params?.color.value !== details.color?.value
            ) {
              await dbSetLedger(details);
            }
            navigation.goBack();
          }}
        />
      </View>
    </CPNPageView>
  );
}
