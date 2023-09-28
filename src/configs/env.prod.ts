import type {EnvVariable} from './env';

const env: Partial<EnvVariable> = {
  apiServerMap: {
    giteePublic: 'public/GPL/ledger-light-rn',
  },

  apiServerList: [
    {
      Domain: 'https://eliot-ye.gitee.io/',
      ServerEnable: ['giteePublic'],
    },
  ],
};
export default env;
