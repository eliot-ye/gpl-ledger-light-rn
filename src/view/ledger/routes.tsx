import React from 'react';
import {RootStack} from '../Router';
import {LedgerDetailsPage} from './LedgerDetailsPage';
import {LedgerItem} from '@/database';

export * from './HomePage';

export type StackParamListHome = {
  LedgerDetailsPage?: LedgerItem;
};

export const RTVHome = (
  <>
    <RootStack.Screen name="LedgerDetailsPage" component={LedgerDetailsPage} />
  </>
);
