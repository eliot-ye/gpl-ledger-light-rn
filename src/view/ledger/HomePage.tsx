import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  CPNIonicons,
  CPNPageView,
  CPNText,
  IONName,
  CPNCellGroup,
  CPNCell,
} from '@/components/base';
import {TouchableOpacity, View} from 'react-native';
import {dbGetLedger, LedgerItem} from '@/database';
import {Colors} from '@/configs/colors';
import {useNavigation} from '@react-navigation/native';
import {PageProps} from '../Router';
import {StoreHomePage} from '@/store';
import {I18n} from '@/assets/I18n';
import {useDimensions} from '@/utils/useDimensions';
import {PieChart} from 'react-native-chart-kit';
import {StyleGet} from '@/configs/styles';
import {colorGetBackground} from '@/utils/tools';
import {CPNNoData} from '@/components/CPNNoData';

export function HomePage() {
  const navigation = useNavigation<PageProps<'Tabbar'>['navigation']>();
  I18n.useLocal();
  const HomePageState = StoreHomePage.useState();

  const [ledgerList, ledgerListSet] = useState<LedgerItem[]>([]);
  const getDBLedgers = useCallback(async () => {
    console.log('HomePageState.updateCount:', HomePageState.updateCount);

    const res = await dbGetLedger();
    // console.log(JSON.stringify(res));

    ledgerListSet(res);
  }, [HomePageState.updateCount]);
  useEffect(() => {
    getDBLedgers();
  }, [getDBLedgers]);

  const AvailableAssets = useMemo(
    () => ledgerList.filter(item => item.assetType.isAvailableAssets),
    [ledgerList],
  );
  const UnAvailableAssets = useMemo(
    () => ledgerList.filter(item => !item.assetType.isAvailableAssets),
    [ledgerList],
  );

  const {width} = useDimensions('window');
  const ChartData = useMemo(
    () => [
      {
        name: I18n.t('UnavailableAssets'),
        amountMoney: UnAvailableAssets.reduce(
          (pre, cur) => pre + cur.amountMoney,
          0,
        ),
        color: Colors.backgroundDisabled,
        legendFontColor: Colors.backgroundDisabled,
      },
      ...AvailableAssets.map(item => ({
        name: `${item.name}(${item.assetType.name})`,
        amountMoney: item.amountMoney,
        color: item.color.value,
        legendFontColor: item.color.value,
      })),
    ],
    [AvailableAssets, UnAvailableAssets],
  );
  function renderChart() {
    if (ChartData.length < 2) {
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

  return (
    <CPNPageView
      title={I18n.t('Ledger')}
      isTabbarPage
      alwaysBounceVertical={false}
      rightIcon={
        <TouchableOpacity
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
                value={`${AvailableAssets.reduce(
                  (pre, cur) => pre + cur.amountMoney,
                  0,
                ).toFixed(2)}`}
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
                  value={`${item.currency.symbol}${item.amountMoney}`}
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
                value={`${UnAvailableAssets.reduce(
                  (pre, cur) => pre + cur.amountMoney,
                  0,
                ).toFixed(2)}`}
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
                  value={`${item.currency.symbol}${item.amountMoney}`}
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
