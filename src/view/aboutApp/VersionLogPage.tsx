import {I18n} from '@/assets/I18n';
import {
  CPNPageView,
  CPNLoading,
  CPNRichTextView,
  CPNText,
} from '@/components/base';
import {Colors} from '@/assets/colors';
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {VersionItem, useApiPublic} from '@/api/public.http';
import {StyleGet} from '@/assets/styles';
import {CusLog} from '@/utils/tools';

export function VersionLogPage() {
  I18n.useLangCode();

  const apiPublic = useApiPublic();

  const [logList, logListSet] = useState<VersionItem[]>([]);
  const apiGetLogData = useCallback(async () => {
    CPNLoading.open();
    try {
      const res = await apiPublic.versionLog();
      logListSet(res.filter(item => item.platform.includes(Platform.OS)));
    } catch (error) {
      CusLog.error('VersionLogPage', 'apiGetLogData', error);
    }
    CPNLoading.close();
  }, [apiPublic]);
  useEffect(() => {
    apiGetLogData();
  }, [apiGetLogData]);

  return (
    <CPNPageView title={I18n.t('VersionLog')}>
      <View style={{padding: 20}}>
        {logList.map(item => {
          return (
            <View
              key={`${item.versionName}.${item.versionCode}`}
              style={[
                StyleGet.boxShadow(),
                {
                  marginBottom: 20,
                  backgroundColor: Colors.backgroundPanel,
                  borderRadius: 10,
                },
              ]}>
              <View
                style={{
                  padding: 10,
                  borderBottomWidth: 0.5,
                  borderBottomColor: Colors.line,
                }}>
                <CPNText style={{fontWeight: '700', color: Colors.theme}}>
                  v{item.versionName}({item.versionCode})
                </CPNText>
              </View>
              <View style={{padding: 10}}>
                <CPNRichTextView richText={item.desc} />
              </View>
            </View>
          );
        })}
      </View>
    </CPNPageView>
  );
}
