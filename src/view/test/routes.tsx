import React from 'react';
import {RootStack} from '../Router';

export * from './HomePage';
export * from './AboutPage';
import {ButtonPage} from './ButtonPage';
import {AlertPage} from './AlertPage';
import {ToastPage} from './ToastPage';
import {LoadingPage} from './LoadingPage';
import {PickerPage} from './PickerPage';
import {SwipeItemPage} from './SwipeItemPage';
import {CheckboxPage} from './CheckboxPage';
import {TextPage} from './TextPage';
import {ActionSheetPage} from './ActionSheetPage';
import {TestHttpPage} from './TestHttpPage';
import {RichTextPage} from './RichTextPage';
import {DropdownPage} from './DropdownPage';
import {TransitionPresets} from '@react-navigation/stack';
import {PageViewPage} from './PageViewPage';

export type TestStackParamList = {
  ButtonPage: undefined;
  AlertPage: undefined;
  ToastPage: undefined;
  LoadingPage: undefined;
  PickerPage: undefined;
  SwipeItemPage: undefined;
  CheckboxPage: undefined;
  TextPage: undefined;
  ActionSheetPage: undefined;
  TestHttpPage: undefined;
  RichTextPage: undefined;
  DropdownPage: undefined;
  PageViewPage: undefined;
};

export const renderTestRouterView = (
  <>
    <RootStack.Screen name="ButtonPage" component={ButtonPage} />
    <RootStack.Screen name="AlertPage" component={AlertPage} />
    <RootStack.Screen name="ToastPage" component={ToastPage} />
    <RootStack.Screen name="LoadingPage" component={LoadingPage} />
    <RootStack.Screen name="PickerPage" component={PickerPage} />
    <RootStack.Screen name="SwipeItemPage" component={SwipeItemPage} />

    <RootStack.Screen
      name="CheckboxPage"
      component={CheckboxPage}
      options={TransitionPresets.ModalPresentationIOS}
    />
    <RootStack.Group
      screenOptions={{
        ...TransitionPresets.ModalPresentationIOS,
      }}>
      <RootStack.Screen name="TextPage" component={TextPage} />
      <RootStack.Screen name="RichTextPage" component={RichTextPage} />
    </RootStack.Group>

    <RootStack.Screen name="ActionSheetPage" component={ActionSheetPage} />
    <RootStack.Screen name="TestHttpPage" component={TestHttpPage} />
    <RootStack.Screen name="DropdownPage" component={DropdownPage} />
    <RootStack.Screen name="PageViewPage" component={PageViewPage} />
  </>
);
