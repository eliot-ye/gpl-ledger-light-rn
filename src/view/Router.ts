import {
  CompositeScreenProps,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import {
  createBottomTabNavigator,
  type BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import type {StackParamListAuthorization} from './authorization/routes';
import type {StackParamListHome} from './ledger/routes';
import type {StackParamListSettings} from './settings/routes';
import type {StackParamListAboutApp} from './aboutApp/routes';

type RootStackParamList = {
  Tabbar: {screen: keyof TabbarStackParamList};
} & StackParamListAuthorization &
  StackParamListAboutApp &
  StackParamListHome &
  StackParamListSettings;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export type PageProps<PageName extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, PageName>;
export const RootStack = createStackNavigator<RootStackParamList>();

export type TabbarStackParamList = {
  HomePage: undefined;
  SettingPage: undefined;
};
export type TabPageProps<PageName extends keyof TabbarStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabbarStackParamList, PageName>,
    StackScreenProps<RootStackParamList>
  >;
export const TabStack = createBottomTabNavigator<TabbarStackParamList>();
