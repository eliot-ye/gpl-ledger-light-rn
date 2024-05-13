import type {EnvVariable} from './env';

const env: Partial<EnvVariable> = {
  envControlPath:
    'https://eliot-ye.gitee.io/public/GPL/ledger-light-rn/control.json',

  apiServerMap: {
    public: 'public/GPL/ledger-light-rn',
  },

  apiServerList: [
    {
      Domain: 'https://eliot-ye.gitee.io/',
      ServerEnable: ['public'],
    },
  ],
};
export default env;
