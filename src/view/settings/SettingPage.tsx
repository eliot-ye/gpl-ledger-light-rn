import {I18n} from '@/assets/I18n';
import {CPNPageView, CPNCell, CPNCellGroup} from '@/components/base';
import React, {useEffect, useState} from 'react';
import {Switch, View} from 'react-native';
import {PageProps} from '../Router';
import {useNavigation} from '@react-navigation/native';
import {envConstant} from '@/configs/env';
import {biometrics} from '@/utils/biometrics';
import {SessionStorage} from '@/store/sessionStorage';

export function SettingPage() {
  const navigation = useNavigation<PageProps<'Tabbar'>['navigation']>();
  I18n.useLocal();

  const [availableBiometrics, availableBiometricsSet] = useState(false);
  useEffect(() => {
    biometrics.isSensorAvailable().then(({available}) => {
      availableBiometricsSet(available);
    });
  }, []);
  const [enableBiometrics, enableBiometricsSet] = useState(false);
  useEffect(() => {
    if (SessionStorage.userId) {
      biometrics
        .getUserFlag(SessionStorage.userId)
        .then(res => {
          if (res === 'true') {
            enableBiometricsSet(true);
          } else {
            enableBiometricsSet(false);
          }
        })
        .catch(() => {
          enableBiometricsSet(false);
        });
    }
  }, []);
  function renderBiometrics() {
    return (
      <CPNCellGroup style={{marginBottom: 20}}>
        <CPNCell
          title={I18n.t('BiometricsEnable')}
          rightIcon={
            <Switch
              value={enableBiometrics}
              onChange={async () => {
                if (!SessionStorage.userId) {
                  return;
                }
                if (!enableBiometrics && SessionStorage.password) {
                  await biometrics.setUser(SessionStorage.userId, {
                    userId: SessionStorage.userId,
                    password: SessionStorage.password,
                  });
                  enableBiometricsSet(true);
                } else {
                  await biometrics.deleteUser(SessionStorage.userId);
                  enableBiometricsSet(false);
                }
              }}
            />
          }
          isLast
        />
      </CPNCellGroup>
    );
  }

  return (
    <CPNPageView title={I18n.t('Settings')} isTabbarPage>
      <View style={{padding: 20}}>
        <CPNCellGroup style={{marginBottom: 20}}>
          <CPNCell
            title={I18n.t('ColorManagement')}
            onPress={() => {
              navigation.navigate('ColorManagementPage');
            }}
          />
          <CPNCell
            title={I18n.t('CurrencyManagement')}
            onPress={() => {
              navigation.navigate('CurrencyManagementPage');
            }}
          />
          <CPNCell
            title={I18n.t('AssetTypeManagement')}
            onPress={() => {
              navigation.navigate('AssetTypeManagementPage');
            }}
            isLast
          />
        </CPNCellGroup>

        <CPNCellGroup style={{marginBottom: 20}}>
          <CPNCell
            title={I18n.t('LanguageSetting')}
            onPress={() => {
              navigation.navigate('LangSettingPage');
            }}
          />
          <CPNCell
            title={I18n.t('Backup')}
            onPress={() => {
              navigation.navigate('BackupPage');
            }}
            isLast
          />
        </CPNCellGroup>

        {availableBiometrics && renderBiometrics()}

        <CPNCellGroup style={{marginBottom: 20}}>
          <CPNCell
            title={I18n.t('About')}
            value={`v${envConstant.versionName}`}
            onPress={() => {
              navigation.navigate('AboutPage');
            }}
            isLast
          />
        </CPNCellGroup>
      </View>
    </CPNPageView>
  );
}
