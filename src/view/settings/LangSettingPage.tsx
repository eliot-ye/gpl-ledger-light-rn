import {I18n, langList} from '@/assets/I18n';
import {
  CPNCell,
  CPNCellGroup,
  CPNCheckbox,
  CPNPageView,
} from '@/components/base';
import {StoreRoot} from '@/store';
import {LS_Lang} from '@/store/localStorage';
import React from 'react';
import {View} from 'react-native';

export function LangSettingPage() {
  const RootState = StoreRoot.useState();
  const RootDispatch = StoreRoot.useDispatch();

  return (
    <CPNPageView title={I18n.LanguageSetting}>
      <View style={{padding: 20}}>
        <CPNCellGroup>
          {langList.map((item, index) => (
            <CPNCell
              key={item.code}
              title={item.label}
              rightIcon={
                <CPNCheckbox
                  isRadio
                  labelShow={false}
                  checked={RootState.langCode === item.code}
                />
              }
              onPress={async () => {
                await LS_Lang.set(item.code);
                RootDispatch('langCode', item.code);
              }}
              isLast={index === langList.length - 1}
            />
          ))}
        </CPNCellGroup>
      </View>
    </CPNPageView>
  );
}
