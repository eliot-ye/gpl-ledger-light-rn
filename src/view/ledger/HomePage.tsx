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
import {StoreHomePage, StoreRoot} from '@/store';
import {I18n} from '@/assets/I18n';
import {useDimensions} from '@/utils/useDimensions';
import {PieChart} from 'react-native-chart-kit';
import {StyleGet} from '@/configs/styles';
import {colorGetLightenBackground} from '@/utils/tools';

export function HomePage() {
  const navigation = useNavigation<PageProps<'Tabbar'>['navigation']>();
  StoreRoot.useState();
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
    () =>
      ledgerList.map(item => ({
        name: `${item.name}(${item.assetType.name})`,
        amountMoney: item.amountMoney,
        color: item.color.value,
        legendFontColor: item.color.value,
      })),
    [ledgerList],
  );
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
          backgroundColor={colorGetLightenBackground(Colors.theme, 0.7)}
          paddingLeft={'20'}
          absolute
          avoidFalseZero
        />
      </View>
    );
  }

  return (
    <CPNPageView
      title={I18n.Ledger}
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
        {AvailableAssets.length > 0 && (
          <>
            <CPNText style={StyleGet.title('h3')}>
              {I18n.AvailableAssets}
            </CPNText>
            <CPNCellGroup style={{marginBottom: 20}}>
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
            <CPNText style={StyleGet.title('h3')}>
              {I18n.UnavailableAssets}
            </CPNText>
            <CPNCellGroup>
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
