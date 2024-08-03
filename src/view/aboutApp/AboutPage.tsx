import {I18n} from '@/assets/I18n';
import {
  CPNPageView,
  CPNCell,
  CPNCellGroup,
  CPNLoading,
  CPNAlert,
  CPNRichTextView,
  CPNImage,
  CPNSwitch,
} from '@/components/base';
import {Colors, ColorsInstance} from '@/assets/colors';
import React, {useRef} from 'react';
import {Dimensions, Linking, Platform, ScrollView, View} from 'react-native';
import {envConstant} from '@/assets/environment';
import {useApiPublic} from '@/api/public.http';
import {useNavigation} from '@react-navigation/native';
import {PageProps} from '../Router';
import {CusLog} from '@/utils/tools';
import {SessionStorage} from '@/store/sessionStorage';

export function AboutPage() {
  const navigation = useNavigation<PageProps<'AboutPage'>['navigation']>();
  I18n.useLangCode();
  ColorsInstance.useCode();
  const apiPublic = useApiPublic();

  const clickVersionCount = useRef(0);
  function renderVersion(isLast?: boolean) {
    return (
      <CPNCell
        title={I18n.t('Version')}
        value={`v${envConstant.versionName} (${envConstant.versionCode})`}
        showChevron={false}
        onPress={() => {
          clickVersionCount.current++;
          if (clickVersionCount.current >= 5) {
            clickVersionCount.current = 0;
            SessionStorage.update('isDebug', true);
          }
        }}
        isLast={isLast}
      />
    );
  }

  const isDebug = SessionStorage.useState('isDebug');
  function renderDebug() {
    return (
      <CPNCellGroup style={{marginBottom: 20}}>
        <CPNCell
          title={I18n.t('Debug')}
          value={
            <CPNSwitch
              value={isDebug}
              onChange={_value => {
                SessionStorage.update('isDebug', _value);
              }}
            />
          }
        />
        <CPNCell title="SDK API Version" value={Platform.Version} isLast />
      </CPNCellGroup>
    );
  }

  function renderCheckUpdates(isLast?: boolean) {
    return (
      <CPNCell
        title={I18n.t('CheckUpdates')}
        onPress={async () => {
          CPNLoading.open();
          try {
            const res = await apiPublic.nowVersion();
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
                    text: I18n.t('Update'),
                    textColor: Colors.theme,
                    onPress() {
                      const defaultUpdateLink = Platform.select({
                        android: `market://details?id=${envConstant.bundleId}`,
                        ios: `itms-apps://itunes.apple.com/us/app/id${envConstant.iosAppStoreId}?mt=8`,
                      });

                      const updateLink =
                        versionData.updateLinks?.find(
                          item => item.platform === Platform.OS,
                        )?.updateLink || versionData.updateLink;

                      Linking.openURL(updateLink || defaultUpdateLink!);
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
            if (isDebug) {
              CPNAlert.alert('error', error as string);
            }
            CusLog.error('About', 'nowVersion', error);
          }
          CPNLoading.close();
        }}
        isLast={isLast}
      />
    );
  }

  return (
    <CPNPageView title={I18n.t('About')}>
      <View
        style={{
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.backgroundPanel,
        }}>
        <CPNImage name="logoGreen" size={200} />
      </View>
      <View style={{padding: 20}}>
        <CPNCellGroup style={{marginBottom: 20}}>
          <CPNCell
            title={I18n.t('LanguageSetting')}
            onPress={() => {
              navigation.navigate('LangSettingPage');
            }}
          />
          <CPNCell
            title={I18n.t('ThemeSetting')}
            onPress={() => {
              navigation.navigate('ThemeSettingPage');
            }}
            isLast
          />
        </CPNCellGroup>

        <CPNCellGroup style={{marginBottom: 20}}>
          {renderVersion()}
          {renderCheckUpdates(true)}
        </CPNCellGroup>
        {isDebug && renderDebug()}

        <CPNCellGroup style={{marginBottom: 20}}>
          <OpenUrlCell
            title={I18n.t('Github')}
            url="https://github.com/eliot-ye/gpl-ledger-light-rn"
          />
          <OpenUrlCell
            title={I18n.t('Gitee')}
            url="https://gitee.com/eliot-ye/gpl-ledger-light-rn"
          />
          <OpenUrlCell
            title={I18n.t('Issues')}
            url="https://gitee.com/eliot-ye/gpl-ledger-light-rn/issues"
            isLast
          />
        </CPNCellGroup>
      </View>
    </CPNPageView>
  );
}

interface OpenUrlCellProps {
  title: string;
  url: string;
  isLast?: boolean;
}
function OpenUrlCell(props: Readonly<OpenUrlCellProps>) {
  return (
    <CPNCell
      title={props.title}
      onPress={() => {
        Linking.openURL(props.url);
      }}
      isLast={props.isLast}
    />
  );
}
