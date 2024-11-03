import {I18n} from '@/assets/I18n';
import {Colors, ColorsInstance} from '@/assets/colors';
import {
  IONName,
  CPNPageViewBottomInsetCtx,
  CPNText,
  CPNToast,
  CPNIonicons,
  FontColorContext,
} from '@/components/base';
import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, BackHandler} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PageProps, TabbarStackParamList, TabStack} from './Router';
import {WindowSize} from '@/utils/dimensions';
import ExitApp from 'react-native-exit-app';

import {HomePage} from './ledger/routes';
import {SettingPage} from './settings/routes';

export function TabBarView({navigation}: PageProps<'Tabbar'>) {
  I18n.useLangCode();
  ColorsInstance.useCode();

  const windowSize = WindowSize.useDimensions('window');
  const maxWidth = WindowSize.breakpointWidth.sm;

  const edgeInsets = useSafeAreaInsets();
  const defHeight = 50 + edgeInsets.bottom;
  const [height, setHeight] = useState(defHeight);

  const [activeScreen, setActiveScreen] =
    useState<keyof TabbarStackParamList>('HomePage');
  useEffect(() => {
    return navigation.addListener('state', ev => {
      const tabbarObj = ev.data.state.routes.find(
        (item: any) => item.name === 'Tabbar',
      );
      const _activeScreen =
        tabbarObj?.state?.routeNames?.[tabbarObj?.state?.index ?? 0];
      if (_activeScreen) {
        setActiveScreen(_activeScreen as keyof TabbarStackParamList);
      }
    });
  }, [navigation]);

  useEffect(() => {
    let canExitApp = false;
    function onBackPress() {
      if (canExitApp) {
        ExitApp.exitApp();
      } else {
        const id = CPNToast.open(I18n.t('PressAgainToExit'));
        canExitApp = true;
        setTimeout(() => {
          CPNToast.close(id);
          canExitApp = false;
        }, 2000);
      }
    }
    function handleBackButton() {
      const isFocused = navigation.isFocused();
      if (isFocused) {
        onBackPress();
      }
      return isFocused;
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [navigation]);

  const tabbarOptionList: TabbarOption[] = [
    {
      name: 'HomePage',
      label: I18n.t('Ledger'),
      icon: <CPNIonicons name={IONName.Home} size={20} />,
      iconActive: <CPNIonicons name={IONName.Home} />,
    },
    {
      name: 'SettingPage',
      label: I18n.t('About'),
      icon: <CPNIonicons name={IONName.Settings} size={20} />,
      iconActive: <CPNIonicons name={IONName.Settings} />,
    },
  ];

  return (
    <CPNPageViewBottomInsetCtx.Provider value={height}>
      <View style={{flex: 1}}>
        <TabStack.Navigator
          tabBar={() => null}
          initialRouteName={'HomePage'}
          screenOptions={{headerShown: false}}>
          <TabStack.Screen name="HomePage" component={HomePage} />
          <TabStack.Screen name="SettingPage" component={SettingPage} />
        </TabStack.Navigator>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: Colors.backgroundPanel,
            paddingLeft: edgeInsets.left,
            paddingRight: edgeInsets.right,
            width: '100%',
            alignItems: 'center',
          }}
          onLayout={ev => setHeight(ev.nativeEvent.layout.height)}>
          <View
            accessibilityRole="toolbar"
            style={{
              width: '100%',
              maxWidth: maxWidth,
              height: defHeight,
              flexDirection: 'row',
            }}>
            {tabbarOptionList.map(item => (
              <FontColorContext.Provider
                key={item.name}
                value={
                  item.name === activeScreen ? Colors.theme : Colors.fontTitle
                }>
                <TouchableOpacity
                  accessibilityRole="tab"
                  activeOpacity={item.name === activeScreen ? 1 : 0.3}
                  key={item.name}
                  onPress={() => {
                    if (item.name !== activeScreen) {
                      navigation.navigate(item.name as any);
                    }
                  }}
                  style={[
                    {
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: 5,
                      paddingBottom: edgeInsets.bottom || 5,
                    },
                    windowSize.width >= maxWidth && {
                      flexDirection: 'row',
                      justifyContent: 'center',
                    },
                  ]}>
                  {item.name === activeScreen
                    ? item.iconActive ?? item.icon
                    : item.icon}
                  <View style={{width: 5, height: 1}} />
                  <CPNText style={{fontSize: 12}}>{item.label}</CPNText>
                </TouchableOpacity>
              </FontColorContext.Provider>
            ))}
          </View>
        </View>
      </View>
    </CPNPageViewBottomInsetCtx.Provider>
  );
}

interface TabbarOption {
  name: keyof TabbarStackParamList;
  label: string;
  icon: React.ReactNode;
  iconActive?: React.ReactNode;
}
