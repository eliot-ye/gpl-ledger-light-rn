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

  const [availableBiometrics, availableBiometricsSet] = useState(false);
  useEffect(() => {
    biometrics.isSensorAvailable().then(({available}) => {
      availableBiometricsSet(available);
    });
  }, []);
  const [enableBiometrics, enableBiometricsSet] = useState(false);
  function renderBiometrics() {
    return (
      <CPNCellGroup style={{marginBottom: 20}}>
        <CPNCell
          title={I18n.Biometrics}
          rightIcon={
            <Switch
              value={enableBiometrics}
              onChange={async () => {
                if (
                  !enableBiometrics &&
                  SessionStorage.userId &&
                  SessionStorage.password
                ) {
                  await biometrics.setUser(
                    SessionStorage.userId,
                    SessionStorage.password,
                  );
                  enableBiometricsSet(true);
                } else {
                  await biometrics.deleteUser();
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
    <CPNPageView title={I18n.Settings} hideBack>
      <View style={{padding: 20}}>
        <CPNCellGroup style={{marginBottom: 20}}>
          <CPNCell
            title={I18n.ColorManagement}
            onPress={() => {
              navigation.navigate('ColorManagementPage');
            }}
          />
          <CPNCell
            title={I18n.CurrencyManagement}
            onPress={() => {
              navigation.navigate('CurrencyManagementPage');
            }}
          />
          <CPNCell
            title={I18n.AssetTypeManagement}
            onPress={() => {
              navigation.navigate('AssetTypeManagementPage');
            }}
            isLast
          />
        </CPNCellGroup>

        {availableBiometrics && renderBiometrics()}

        <CPNCellGroup style={{marginBottom: 20}}>
          <CPNCell
            title={I18n.About}
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
