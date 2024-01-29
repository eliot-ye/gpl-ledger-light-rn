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
