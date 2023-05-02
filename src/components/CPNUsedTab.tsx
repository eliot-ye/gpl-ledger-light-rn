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
  const tabButtons: {
    text: string;
    value: ShowTabType;
  }[] = [
    {text: I18n.All, value: ShowTabType.All},
    {text: I18n.Used, value: ShowTabType.Used},
    {text: I18n.NotUsed, value: ShowTabType.NotUsed},
  ];

  return (
    <CPNButtonGroup
      buttonList={tabButtons}
      value={props.value}
      onPress={props.onChange}
    />
  );
}
