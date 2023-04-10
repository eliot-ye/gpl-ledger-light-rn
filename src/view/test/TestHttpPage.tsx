import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  CPNButton,
  CPNDropdown,
  CPNLoading,
  CPNPageView,
  CPNRichTextView,
} from '@/components/base';
import {useApiTest} from '@/api/http.test1';
import {View} from 'react-native';
import {useApiSeedData} from '@/api/http.test2';

export function TestHttpPage() {
  const apiTest = useApiTest();

  const [showStr, showStrSet] = useState('');
  const getShowStr = useCallback(
    async function () {
      CPNLoading.open();
      try {
        const res = await apiTest.getJoke();
        showStrSet(res);
      } catch (error) {}
      CPNLoading.close();
    },
    [apiTest],
  );

  const apiSeedData = useApiSeedData();
  const [countryList, countryListSet] = useState<any[]>([]);
  const [countryActive, countryActiveSet] = useState<number>(0);
  const CountryListShow = useMemo(
    () =>
      countryList.map(item => ({
        ...item,
        label: `${item.countryNm} - ${item.countryNmKey} - ${item.countryPhoneCd}`,
        value: item.countryId,
      })),
    [countryList],
  );
  const getSeedData = useCallback(async () => {
    CPNLoading.open();
    try {
      const res = await apiSeedData.fetchCountryMasterSeedData();
      if (res.serviceResponseCode === 200) {
        countryListSet(res.data.COUNTRIES);
      }
    } catch (error) {}
    CPNLoading.close();
  }, [apiSeedData]);

  useEffect(() => {
    console.log('TestHttpPage init');
    getSeedData();
    getShowStr();
  }, [getSeedData, getShowStr]);

  return (
    <CPNPageView titleText="Get Show String">
      <View style={{padding: 20}}>
        <View style={{paddingBottom: 20}}>
          <CPNDropdown
            data={CountryListShow}
            checked={countryActive}
            onSelect={item => {
              countryActiveSet(item.value);
            }}
          />
        </View>
        <CPNButton text="Get Show String" onPress={getShowStr} />
        <View style={{padding: 20}}>
          <CPNRichTextView richText={showStr} />
        </View>
      </View>
    </CPNPageView>
  );
}
