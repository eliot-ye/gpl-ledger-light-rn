import {useMemo} from 'react';
import {useFetch} from './http';

export function useApiSeedData() {
  const apiPost = useFetch(
    'seedData',
    useMemo(
      () => ({
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJAcnJpdkB8RGVwQHJ0dXJlIiwiaWF0IjoxNTI0NDYxMTQ2LCJzdWIiOiJQfEB6QFByZW0hdW1HcjB1cEFycnR1cmVISyIsImlzcyI6IlZpbmN1bHVtU29sdXRpb25zUHZ0THRkTm9pZGFUZWFtQXJydHVyZSIsImV4cCI6MzEwMjM4NDM0N30.reelOi7e0iLurWQCSpuP-qLXsJm9A8JkUmMSMd-aqZQ',
          'login-mode': 'WLAPPG',
          'x-ppgapi-subscription': 'e7ec61929e2049148e366b7d243ee939StPmdf',
          'cognito-username': 'SANJEEV',
          'Accept-Language': 'zh-cn',
        },
      }),
      [],
    ),
  );

  return useMemo(
    () => ({
      /** 獲取國家列表 */
      fetchCountryMasterSeedData() {
        return apiPost('/fetchCountryMasterSeedData', {
          partnerId: 1,
          systemPartnerId: 1,
          programId: 6,
        });
      },
    }),
    [apiPost],
  );
}
