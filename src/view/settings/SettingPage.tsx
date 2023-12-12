import {I18n} from '@/assets/I18n';
import {CPNPageView, CPNCell, CPNCellGroup, CPNAlert} from '@/components/base';
import React, {useEffect, useState} from 'react';
import {Switch, View} from 'react-native';
import {PageProps} from '../Router';
import {useNavigation} from '@react-navigation/native';
import {envConstant} from '@/configs/env';
import {biometrics} from '@/utils/biometrics';
import {CusLog} from '@/utils/tools';
import {ColorsInstance} from '@/configs/colors';
import {Store} from '@/store';

export function SettingPage() {
  const navigation = useNavigation<PageProps<'Tabbar'>['navigation']>();
  I18n.useLocal();
  ColorsInstance.useTheme();

  const [availableBiometrics, availableBiometricsSet] = useState(false);
  const [enableBiometrics, enableBiometricsSet] = useState(false);
  useEffect(() => {
    biometrics
      .isSensorAvailable()
      .then(({available}) => {
        availableBiometricsSet(available);

        const biometriceToken = Store.get('biometriceToken');
        if (available && biometriceToken) {
          return biometrics.getUserFlag(biometriceToken);
        }
        return Promise.reject();
      })
      .then(hasUserFlag => {
        enableBiometricsSet(hasUserFlag);
      });
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
                const userId = Store.get('userId');
                if (!userId) {
                  return;
                }
                try {
                  const password = Store.get('password');
                  if (!enableBiometrics && password) {
                    await biometrics.setUser({
                      userId: userId,
                      password: password,
                    });
                    enableBiometricsSet(true);
                  } else {
                    const biometriceToken = Store.get('biometriceToken');
                    if (biometriceToken) {
                      await biometrics.deleteUser(biometriceToken);
                    }
                    enableBiometricsSet(false);
                  }
                } catch (error: any) {
                  CPNAlert.alert('', error);
                  CusLog.error('SettingPage', 'BiometricsEnable', error);
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
