import {I18n} from '@/assets/I18n';
import {
  CPNPageView,
  CPNLoading,
  CPNRichTextView,
  CPNText,
} from '@/components/base';
import {Colors} from '@/configs/colors';
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {VersionItem, useApiGiteePublic} from '@/api/http.giteePublic';
import {StyleGet} from '@/configs/styles';

export function VersionLogPage() {
  const apiGiteePublic = useApiGiteePublic();

  const [logList, logListSet] = useState<VersionItem[]>([]);
  const apiGetLogData = useCallback(async () => {
    CPNLoading.open();
    try {
      const res = await apiGiteePublic.versionLog();
      logListSet(
        res.filter(
          item => item.platform === 'all' || item.platform === Platform.OS,
        ),
      );
    } catch (error) {}
    CPNLoading.close();
  }, [apiGiteePublic]);
  useEffect(() => {
    apiGetLogData();
  }, [apiGetLogData]);

  return (
    <CPNPageView titleText={I18n.VersionLog}>
      <View style={{padding: 20}}>
        {logList.map(item => {
          return (
            <View
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
                <CPNText>
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
