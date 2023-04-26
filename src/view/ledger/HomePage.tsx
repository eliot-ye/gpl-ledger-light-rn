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

export function HomePage() {
  const navigation = useNavigation<PageProps<'Tabbar'>['navigation']>();
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

  return (
    <CPNPageView
      title={I18n.Ledger}
      rightIcon={
        <TouchableOpacity
          onPress={async () => {
            navigation.navigate('LedgerDetailsPage');
          }}>
          <CPNIonicons name={IONName.Add} />
        </TouchableOpacity>
      }>
      <View style={{padding: 20}}>
        {AvailableAssets.length > 0 && (
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
        )}

        {UnAvailableAssets.length > 0 && (
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
        )}
      </View>
    </CPNPageView>
  );
}
