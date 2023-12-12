import {I18n} from '@/assets/I18n';
import {
  CPNPageView,
  CPNCell,
  CPNCellGroup,
  CPNLoading,
  CPNAlert,
  CPNRichTextView,
  CPNImage,
} from '@/components/base';
import {Colors} from '@/configs/colors';
import React from 'react';
import {Dimensions, Linking, Platform, ScrollView, View} from 'react-native';
import {envConstant} from '@/configs/env';
import {useApiGiteePublic} from '@/api/http.giteePublic';
import {useNavigation} from '@react-navigation/native';
import {PageProps} from '../Router';
import {CusLog} from '@/utils/tools';

export function AboutPage() {
  const navigation = useNavigation<PageProps<'AboutPage'>['navigation']>();
  I18n.useLocal();
  const apiGiteePublic = useApiGiteePublic();

  function renderVersion(isLast?: boolean) {
    return (
      <CPNCell
        title={I18n.t('Version')}
        value={`v${envConstant.versionName} (${envConstant.versionCode})`}
        showChevron={false}
        onPress={() => {
          // todo some thing
        }}
        isLast={isLast}
      />
    );
  }

  function renderCheckUpdates(isLast?: boolean) {
    return (
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
              versionData.versionCode > envConstant.versionCode
            ) {
              CPNAlert.open({
                title: I18n.f(
                  I18n.t('DiscoveringNewVersion'),
                  versionData.versionName,
                ),
                message: (
                  <ScrollView
                    style={{
                      maxHeight: Dimensions.get('window').height / 2,
                    }}>
                    <CPNRichTextView richText={versionData.desc} />
                  </ScrollView>
                ),
                buttons: [
                  {
                    text: I18n.t('Confirm'),
                    textColor: Colors.theme,
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
                    textColor: Colors.theme,
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
        isLast={isLast}
      />
    );
  }

  function renderGithub(isLast?: boolean) {
    const url = 'https://github.com/eliot-ye/gpl-ledger-light-rn';
    return (
      <CPNCell
        title={I18n.t('Github')}
        onPress={() => {
          Linking.openURL(url);
        }}
        isLast={isLast}
      />
    );
  }
  function renderGitee(isLast?: boolean) {
    const url = 'https://gitee.com/eliot-ye/gpl-ledger-light-rn';
    return (
      <CPNCell
        title={I18n.t('Gitee')}
        onPress={() => {
          Linking.openURL(url);
        }}
        isLast={isLast}
      />
    );
  }
  function renderIssues(isLast?: boolean) {
    const url = 'https://gitee.com/eliot-ye/gpl-ledger-light-rn/issues';
    return (
      <CPNCell
        title={I18n.t('Issues')}
        onPress={() => {
          Linking.openURL(url);
        }}
        isLast={isLast}
      />
    );
  }

  return (
    <CPNPageView title={I18n.t('About')}>
      <View
        style={{
          height: 300,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.backgroundPanel,
        }}>
        <CPNImage name="logoGreen" size={300} />
      </View>
      <View style={{padding: 20}}>
        <CPNCellGroup style={{marginBottom: 20}}>
          {renderVersion()}
          {renderCheckUpdates(true)}
        </CPNCellGroup>
        <CPNCellGroup style={{marginBottom: 20}}>
          {renderGithub()}
          {renderGitee()}
          {renderIssues(true)}
        </CPNCellGroup>
      </View>
    </CPNPageView>
  );
}
