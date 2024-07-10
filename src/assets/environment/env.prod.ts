import type {EnvVariable} from '.';

const env: Partial<EnvVariable> = {
  envControlPath:
    'https://eliot-ye.github.io/public/GPL/ledger-light-rn/control.json',

  apiServerMap: {
    public: 'public/GPL/ledger-light-rn',
  },

  apiServerList: [
    {
      Domain: 'https://eliot-ye.github.io/',
      ServerEnable: ['public'],
    },
  ],
};
export default env;
