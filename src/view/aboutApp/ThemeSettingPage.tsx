import {I18n} from '@/assets/I18n';
import {
  CPNCell,
  CPNCellGroup,
  CPNCheckbox,
  CPNPageView,
} from '@/components/base';
import {ColorsInstance, ThemeCode} from '@/configs/colors';
import {LS} from '@/store/localStorage';
import React, {useEffect, useState} from 'react';
import {View, useColorScheme} from 'react-native';

export function ThemeSettingPage() {
  I18n.useLocal();

  const themeList = [
    {label: I18n.t('ThemeSystem'), code: 'system'},
    {label: I18n.t('ThemeLight'), code: ThemeCode.default},
    {label: I18n.t('ThemeDark'), code: ThemeCode.dark},
  ];

  const [themeValue, themeValueSet] = useState('system');
  useEffect(() => {
    LS.get('theme_code').then(_code => {
      themeValueSet(_code || 'system');
    });
  }, []);

  const systemTheme = useColorScheme() as ThemeCode;

  return (
    <CPNPageView title={I18n.t('ThemeSetting')}>
      <View style={{padding: 20}}>
        <CPNCellGroup>
          {themeList.map((item, index) => (
            <CPNCell
              key={item.code}
              title={item.label}
              rightIcon={
                <View pointerEvents="none">
                  <CPNCheckbox isRadio checked={themeValue === item.code} />
                </View>
              }
              onPress={async () => {
                themeValueSet(item.code);
                if (item.code === 'system') {
                  await LS.set('theme_code', null);
                } else {
                  await LS.set('theme_code', item.code as ThemeCode);
                }
                const _val = await LS.get('theme_code');
                ColorsInstance.setTheme(
                  _val || systemTheme || ThemeCode.default,
                );
              }}
              isLast={index === themeList.length - 1}
            />
          ))}
        </CPNCellGroup>
      </View>
    </CPNPageView>
  );
}
