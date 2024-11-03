import {I18n} from '@/assets/I18n';
import {
  CPNPageView,
  CPNCell,
  CPNCellGroup,
  CPNAlert,
  CPNSwitch,
} from '@/components/base';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {PageProps} from '../Router';
import {useNavigation} from '@react-navigation/native';
import {envConstant} from '@/assets/environment';
import {biometrics} from '@/utils/biometrics';
import {CusLog} from '@/utils/tools';
import {ColorsInstance} from '@/assets/colors';
import {SessionStorage} from '@/store/sessionStorage';
import {useLSUserInfoList} from '@/store/localStorage';

export function SettingPage() {
  const navigation = useNavigation<PageProps<'Tabbar'>['navigation']>();
  I18n.useLangCode();
  ColorsInstance.useCode();

  const useInfoList = useLSUserInfoList();
  function renderAccount() {
    return (
      <CPNCellGroup style={{marginBottom: 20}}>
        <CPNCell
          title={I18n.t('AccountDetail')}
          onPress={() => {
            const useInfo = useInfoList.find(
              item => item.id === SessionStorage.get('userId'),
            );
            if (!useInfo) {
              return;
            }
            navigation.navigate('AccountInfoPage', {
              ...useInfo,
              password: SessionStorage.get('password'),
            });
          }}
          isLast
        />
      </CPNCellGroup>
    );
  }

  const [availableBiometrics, availableBiometricsSet] = useState(false);
  const [enableBiometrics, enableBiometricsSet] = useState(false);
  useEffect(() => {
    biometrics
      .isSensorAvailable()
      .then(({available}) => {
        availableBiometricsSet(available);

        const biometriceToken = SessionStorage.get('biometriceToken');
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
            <CPNSwitch
              value={enableBiometrics}
              onChange={async _value => {
                const userId = SessionStorage.get('userId');
                if (!userId) {
                  return;
                }
                try {
                  const password = SessionStorage.get('password');
                  if (_value && password) {
                    await biometrics.setUser({
                      userId: userId,
                      password: password,
                    });
                    enableBiometricsSet(true);
                  } else {
                    const biometriceToken =
                      SessionStorage.get('biometriceToken');
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
    <CPNPageView title={I18n.t('Settings')} leftIcon={<View />}>
      <View style={{padding: 20}}>
        {renderAccount()}
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
