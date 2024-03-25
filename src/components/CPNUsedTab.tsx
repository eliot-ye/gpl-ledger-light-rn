import {I18n} from '@/assets/I18n';
import React from 'react';
import {CPNButtonGroup} from './base';

// export type ShowTabType = 'All' | 'Used' | 'Unused';
export enum ShowTabType {
  All = 'All',
  Used = 'Used',
  Unused = 'Unused',
}

interface CPNUsedTabProps {
  value: ShowTabType;
  onChange: (type: ShowTabType) => void;
}
export function CPNUsedTab(props: CPNUsedTabProps) {
  I18n.useLangCode();

  const tabButtons: {
    text: string;
    value: ShowTabType;
  }[] = [
    {text: I18n.t('All'), value: ShowTabType.All},
    {text: I18n.t('Used'), value: ShowTabType.Used},
    {text: I18n.t('Unused'), value: ShowTabType.Unused},
  ];

  return (
    <CPNButtonGroup
      buttonList={tabButtons}
      value={props.value}
      onPress={props.onChange}
    />
  );
}
