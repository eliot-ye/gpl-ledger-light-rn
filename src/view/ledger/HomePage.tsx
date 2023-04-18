import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {CPNIonicons, CPNPageView, CPNText, IONName} from '@/components/base';
import {LedgerItem} from '@/database/ledger/schema';
import {TouchableOpacity, View} from 'react-native';
import {dbGetLedger} from '@/database/ledger/handle';
import {CNPCellGroup, CNPCell} from '@/components';
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
      titleText={I18n.Ledger}
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
          <CNPCellGroup style={{marginBottom: 40}}>
            {AvailableAssets.map((item, index) => (
              <CNPCell
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
                value={item.amountMoney}
                onPress={() => {
                  navigation.navigate('LedgerDetailsPage', item);
                }}
              />
            ))}
          </CNPCellGroup>
        )}

        {UnAvailableAssets.length > 0 && (
          <CNPCellGroup>
            {UnAvailableAssets.map((item, index) => (
              <CNPCell
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
                value={item.amountMoney}
                onPress={() => {
                  navigation.navigate('LedgerDetailsPage', item);
                }}
              />
            ))}
          </CNPCellGroup>
        )}
      </View>
    </CPNPageView>
  );
}
