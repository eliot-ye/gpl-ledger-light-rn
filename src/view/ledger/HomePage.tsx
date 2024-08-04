import React, {useEffect, useMemo} from 'react';
import {
  CPNIonicons,
  CPNPageView,
  CPNText,
  IONName,
  CPNCellGroup,
  CPNCell,
  HeaderConfigs,
} from '@/components/base';
import {TouchableOpacity, View} from 'react-native';
import {useDBGetCurrency, useDBGetLedger} from '@/database';
import {Colors, ColorsInstance} from '@/assets/colors';
import {useNavigation} from '@react-navigation/native';
import {PageProps} from '../Router';
import {I18n} from '@/assets/I18n';
import {useDimensions} from '@/utils/dimensions';
import {PieChart} from 'react-native-chart-kit';
import {StyleGet} from '@/assets/styles';
import {colorGetBackground} from '@/utils/tools';
import {CPNNoData} from '@/components/CPNNoData';
import {CPNCurrencyView} from '@/components/CPNCurrencyView';
import {nativePackage} from '@/utils/nativePackage';

export function HomePage() {
  const navigation = useNavigation<PageProps<'Tabbar'>['navigation']>();
  I18n.useLangCode();
  ColorsInstance.useCode();

  useEffect(() => {
    nativePackage.setFlag(true);
    return () => {
      nativePackage.setFlag(false);
    };
  }, []);

  const currencyList = useDBGetCurrency();
  const ledgerList = useDBGetLedger();

  const AvailableAssets = useMemo(
    () => ledgerList.filter(item => item.assetType.isAvailableAssets),
    [ledgerList],
  );
  const UnAvailableAssets = useMemo(
    () => ledgerList.filter(item => !item.assetType.isAvailableAssets),
    [ledgerList],
  );

  const {width} = useDimensions('window');
  const ChartData = useMemo(() => {
    const data = AvailableAssets.map(item => ({
      name: `${item.currency.symbol} ${item.name}`,
      amountMoney: item.amountMoney,
      color: item.color.value,
      legendFontColor: item.color.value,
    }));
    currencyList.forEach(item => {
      const amountMoney = UnAvailableAssets.filter(
        _item => _item.currency.abbreviation === item.abbreviation,
      ).reduce((pre, cur) => pre + cur.amountMoney, 0);
      if (amountMoney > 0) {
        data.push({
          name: `${item.symbol} ${I18n.t('UnavailableAssets')}`,
          amountMoney,
          color: Colors.backgroundBlack,
          legendFontColor: Colors.backgroundBlack,
        });
      }
    });
    return data;
  }, [AvailableAssets, UnAvailableAssets, currencyList]);
  function renderChart() {
    if (ChartData.length < 1) {
      return;
    }

    return (
      <View>
        <PieChart
          data={ChartData}
          width={width}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor={'amountMoney'}
          backgroundColor={colorGetBackground(Colors.theme)}
          paddingLeft={'20'}
          absolute
          avoidFalseZero
        />
      </View>
    );
  }

  const AvailableAssetsTotal = useMemo(
    () =>
      currencyList.map(item => {
        return {
          ...item,
          amount: AvailableAssets.filter(
            _item => _item.currency.abbreviation === item.abbreviation,
          )
            .reduce((pre, cur) => pre + cur.amountMoney, 0)
            .toFixed(2),
        };
      }),
    [AvailableAssets, currencyList],
  );
  const UnAvailableAssetsTotal = useMemo(
    () =>
      currencyList.map(item => {
        return {
          ...item,
          amount: UnAvailableAssets.filter(
            _item => _item.currency.abbreviation === item.abbreviation,
          )
            .reduce((pre, cur) => pre + cur.amountMoney, 0)
            .toFixed(2),
        };
      }),
    [UnAvailableAssets, currencyList],
  );

  return (
    <CPNPageView
      title={I18n.t('Ledger')}
      alwaysBounceVertical={false}
      rightIcon={
        <TouchableOpacity
          style={{paddingRight: HeaderConfigs.paddingHorizontal}}
          onPress={async () => {
            navigation.navigate('LedgerDetailsPage');
          }}>
          <CPNIonicons name={IONName.Add} />
        </TouchableOpacity>
      }>
      {renderChart()}
      <View style={{padding: 20}}>
        {AvailableAssets.length === 0 && UnAvailableAssets.length === 0 && (
          <CPNNoData />
        )}

        {AvailableAssets.length > 0 && (
          <>
            <CPNText style={[StyleGet.title('h5'), {marginBottom: 6}]}>
              {I18n.t('AvailableAssets')}
            </CPNText>
            <CPNCellGroup style={{marginBottom: 20}}>
              <CPNCell
                title={I18n.t('Total')}
                value={
                  <View>
                    {AvailableAssetsTotal.map(item => {
                      if (item.amount === '0.00') {
                        return;
                      }
                      return (
                        <CPNCurrencyView
                          key={item.abbreviation}
                          symbol={item.symbol}
                          amount={item.amount}
                        />
                      );
                    })}
                  </View>
                }
              />
              {AvailableAssets.map((item, index) => (
                <CPNCell
                  isLast={index === AvailableAssets.length - 1}
                  key={item.id}
                  title={
                    <>
                      <CPNText>{item.name}</CPNText>
                      <View
                        style={{
                          borderRadius: 4,
                          paddingHorizontal: 3,
                          paddingVertical: 2,
                          backgroundColor: item.color.value,
                          marginLeft: 6,
                        }}>
                        <CPNText
                          style={{color: Colors.fontTextReverse, fontSize: 14}}>
                          {item.assetType.name}
                        </CPNText>
                      </View>
                    </>
                  }
                  value={
                    <CPNCurrencyView
                      symbol={item.currency.symbol}
                      amount={item.amountMoney}
                    />
                  }
                  onPress={() => {
                    navigation.navigate('LedgerDetailsPage', item);
                  }}
                />
              ))}
            </CPNCellGroup>
          </>
        )}

        {UnAvailableAssets.length > 0 && (
          <>
            <CPNText style={[StyleGet.title('h5'), {marginBottom: 6}]}>
              {I18n.t('UnavailableAssets')}
            </CPNText>
            <CPNCellGroup>
              <CPNCell
                title={I18n.t('Total')}
                value={
                  <View>
                    {UnAvailableAssetsTotal.map(item => {
                      if (item.amount === '0.00') {
                        return;
                      }
                      return (
                        <CPNCurrencyView
                          key={item.abbreviation}
                          symbol={item.symbol}
                          amount={item.amount}
                        />
                      );
                    })}
                  </View>
                }
              />
              {UnAvailableAssets.map((item, index) => (
                <CPNCell
                  isLast={index === UnAvailableAssets.length - 1}
                  key={item.id}
                  title={
                    <>
                      <CPNText>{item.name}</CPNText>
                      <View
                        style={{
                          borderRadius: 4,
                          paddingHorizontal: 3,
                          paddingVertical: 2,
                          backgroundColor: item.color.value,
                          marginLeft: 6,
                        }}>
                        <CPNText
                          style={{color: Colors.fontTextReverse, fontSize: 14}}>
                          {item.assetType.name}
                        </CPNText>
                      </View>
                    </>
                  }
                  value={
                    <CPNCurrencyView
                      symbol={item.currency.symbol}
                      amount={item.amountMoney}
                    />
                  }
                  onPress={() => {
                    navigation.navigate('LedgerDetailsPage', item);
                  }}
                />
              ))}
            </CPNCellGroup>
          </>
        )}
      </View>
    </CPNPageView>
  );
}
