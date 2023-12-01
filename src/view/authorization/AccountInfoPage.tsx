import {I18n} from '@/assets/I18n';
import {CPNPageView, CPNCellGroup, CPNCell} from '@/components/base';
import React from 'react';
import {View} from 'react-native';
import {PageProps} from '../Router';
import {formatDateTime} from '@/utils/dateFn';

export function AccountInfoPage({route}: PageProps<'AccountInfoPage'>) {
  return (
    <CPNPageView title={I18n.t('AccountManagement')}>
      <View style={{flex: 1, padding: 20}}>
        <CPNCellGroup>
          <CPNCell title="ID" value={route.params.id} />
          <CPNCell title={I18n.t('Username')} value={route.params.username} />
          <CPNCell
            title={I18n.t('CreateTime')}
            value={formatDateTime(Number(route.params.id.split(':')[1]))}
          />
          {!!route.params.lastModified && (
            <CPNCell
              title={I18n.t('LastModified')}
              value={formatDateTime(Number(route.params.lastModified))}
            />
          )}
          <CPNCell isLast title="Token" value={route.params.token} />
        </CPNCellGroup>
      </View>
    </CPNPageView>
  );
}
