import {I18n} from '@/assets/I18n';
import {
  CPNPageView,
  CPNCell,
  CPNCellGroup,
  CPNLoading,
  CPNAlert,
  CPNRichTextView,
} from '@/components/base';
import {Colors} from '@/configs/colors';
import React from 'react';
import {Linking, Platform, View} from 'react-native';
import {envConstant} from '@/configs/env';
import {useApiGiteePublic} from '@/api/http.giteePublic';
import {useNavigation} from '@react-navigation/native';
import {PageProps} from '../Router';
import {CusLog} from '@/utils/tools';

export function AboutPage() {
  const navigation = useNavigation<PageProps<'AboutPage'>['navigation']>();
  I18n.useLocal();
  const apiGiteePublic = useApiGiteePublic();

  return (
    <CPNPageView title={I18n.t('About')}>
      <View
        style={{
          height: 300,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.backgroundPanel,
        }}
      />
      <View style={{padding: 20}}>
        <CPNCellGroup>
          <CPNCell
            title={I18n.t('Version')}
            value={`v${envConstant.versionName} (${envConstant.versionCode})`}
            showChevron={false}
            onPress={() => {
              // todo some thing
            }}
          />
          <CPNCell
            title={I18n.t('CheckUpdates')}
            onPress={async () => {
              CPNLoading.open();
              try {
                const res = await apiGiteePublic.nowVersion();
                const versionData = res.find(item =>
                  item.platform.includes(Platform.OS),
                );
                if (
                  versionData &&
                  versionData.versionCode > Number(envConstant.versionCode)
                ) {
                  CPNAlert.open({
                    title: I18n.f(
                      I18n.t('DiscoveringNewVersion'),
                      versionData.versionName,
                    ),
                    message: <CPNRichTextView richText={versionData.desc} />,
                    buttons: [
                      {
                        text: I18n.t('Confirm'),
                        onPress() {
                          let defaultUpdateLink = '';
                          if (Platform.OS === 'android') {
                            defaultUpdateLink = `market://details?id=${envConstant.bundleId}`;
                          }

                          Linking.openURL(
                            versionData.updateLink || defaultUpdateLink,
                          );
                        },
                      },
                      {
                        text: I18n.t('ViewVersionLog'),
                        onPress() {
                          navigation.navigate('VersionLogPage');
                        },
                      },
                      {
                        text: I18n.t('Cancel'),
                      },
                    ],
                  });
                } else {
                  navigation.navigate('VersionLogPage');
                }
              } catch (error) {
                CusLog.error('About', 'nowVersion', error);
              }
              CPNLoading.close();
            }}
            isLast
          />
        </CPNCellGroup>
      </View>
    </CPNPageView>
  );
}
