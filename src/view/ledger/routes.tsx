import React from 'react';
import {RootStack} from '../Router';
import {LedgerDetailsPage} from './LedgerDetailsPage';
import {LedgerItem} from '@/database/ledger/schema';

export * from './HomePage';

export type HomeStackParamList = {
  LedgerDetailsPage?: LedgerItem;
};

export const renderHomeRouterView = (
  <>
    <RootStack.Screen name="LedgerDetailsPage" component={LedgerDetailsPage} />
  </>
);
