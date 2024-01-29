## 一个简单的记账应用

### 依赖

```bash
yarn add @react-navigation/native @react-navigation/stack react-native-gesture-handler react-native-safe-area-context react-native-screens @react-navigation/bottom-tabs  react-native-device-info color react-native-render-html react-native-vector-icons crypto-js date-fns fast-xml-parser react-native-chart-kit react-native-fs react-native-get-random-values react-native-biometrics react-native-svg realm utf8-byte-length gpl-async-storage rtn-i18n
yarn add -D babel-plugin-module-resolver @types/color @types/crypto-js
```

### 设置映射路径 `@/ -> /src/`

1. 下载 `babel-plugin-module-resolver`

2. 更改 `babel.config.js` 文件

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: getAliasFromTsconfig(),
      },
    ],
  ],
};

function getAliasFromTsconfig() {
  const tsconfig = require('./tsconfig.json');
  const paths = tsconfig.compilerOptions.paths;
  const alias = {};
  Object.keys(paths).forEach(key => {
    const _key = key.replace(/\/\*/g, '');
    alias[_key] = './' + paths[key][0].replace(/\/\*/g, '');
  });
  return alias;
}

```

3. 更改 `tsconfig.json` 文件。

**_注意：tsconfig.json 文件中不能有注释。_**


```json
{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@assets/*": ["src/assets/*"],
      "@images/*": ["src/assets/images/*"],
      "@components/*": ["src/components/*"]
    }
  }
}

```
