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
import {HomePage} from './ledger/routes';
import {SettingPage} from './settings/routes';
import {breakpointWidth, useDimensions} from '@/utils/dimensions';

export function TabBarView({navigation}: PageProps<'Tabbar'>) {
  I18n.useLangCode();
  ColorsInstance.useCode();

  const windowSize = useDimensions('window');
  const isMd = windowSize.width > breakpointWidth.md;
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
        BackHandler.exitApp();
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
      icon: IONName.Home,
    },
    {
      name: 'SettingPage',
      label: I18n.t('Settings'),
      icon: IONName.Settings,
    },
  ];

  return (
    <CPNPageViewBottomInsetCtx.Provider value={height}>
      <View style={{flex: 1}}>
        <TabStack.Navigator
          tabBar={() => null}
          initialRouteName={activeScreen}
          screenOptions={{headerShown: false}}>
          <TabStack.Screen name="HomePage" component={HomePage} />
          <TabStack.Screen name="SettingPage" component={SettingPage} />
        </TabStack.Navigator>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: Colors.backgroundPanel,
            height: defHeight,
            paddingLeft: edgeInsets.left,
            paddingRight: edgeInsets.right,
            width: '100%',
            alignItems: 'center',
          }}
          onLayout={ev => setHeight(ev.nativeEvent.layout.height)}>
          <View
            accessibilityRole="tablist"
            style={{
              width: '100%',
              maxWidth: 300,
              height: '100%',
              flexDirection: 'row',
            }}>
            {tabbarOptionList.map(item => (
              <FontColorContext.Provider
                value={
                  item.name === activeScreen ? Colors.theme : Colors.fontTitle
                }>
                <TouchableOpacity
                  accessibilityRole="tab"
                  key={item.name}
                  onPress={() => {
                    navigation.navigate('Tabbar', {screen: item.name});
                  }}
                  style={[
                    {
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 10,
                      flexDirection: 'column',
                    },
                    isMd && {
                      flexDirection: 'row',
                    },
                  ]}>
                  <CPNIonicons
                    name={item.icon}
                    style={[
                      {marginBottom: 5},
                      isMd && {marginRight: 5, marginBottom: 0},
                    ]}
                  />
                  <CPNText style={{fontSize: isMd ? 16 : 12}}>
                    {item.label}
                  </CPNText>
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
  icon: IONName;
}
