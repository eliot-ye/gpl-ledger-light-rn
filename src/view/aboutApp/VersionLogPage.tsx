import {I18n} from '@/assets/I18n';
import {CPNPageView, CPNRichTextView, CPNText} from '@/components/base';
import {Colors} from '@/assets/colors';
import React, {useMemo} from 'react';
import {Platform, View} from 'react-native';
import {apiPublic} from '@/api/public.http';
import {StyleGet} from '@/assets/styles';
import {useApiState} from '@/api/httpHooks';

export function VersionLogPage() {
  I18n.useLangCode();

  const {data, loading} = useApiState(apiPublic.versionLog, [], {autoFetch: true});

  const dataShown = useMemo(() => {
    return data?.filter(item => item.platform.includes(Platform.OS));
  }, [data]);

  return (
    <CPNPageView loading={loading} title={I18n.t('VersionLog')}>
      <View style={{padding: 20}}>
        {dataShown?.map(item => {
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
