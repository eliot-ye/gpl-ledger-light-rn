import {I18n} from '@/assets/I18n';
import React from 'react';
import {CPNButtonGroup} from './base';

// export type ShowTabType = 'All' | 'Used' | 'NotUsed';
export enum ShowTabType {
  All = 'All',
  Used = 'Used',
  NotUsed = 'NotUsed',
}

interface CPNUsedTabProps {
  value: ShowTabType;
  onChange: (type: ShowTabType) => void;
}
export function CPNUsedTab(props: CPNUsedTabProps) {
  I18n.useLocal();

  const tabButtons: {
    text: string;
    value: ShowTabType;
  }[] = [
    {text: I18n.t('All'), value: ShowTabType.All},
    {text: I18n.t('Used'), value: ShowTabType.Used},
    {text: I18n.t('NotUsed'), value: ShowTabType.NotUsed},
  ];

  return (
    <CPNButtonGroup
      buttonList={tabButtons}
      value={props.value}
      onPress={props.onChange}
    />
  );
}
