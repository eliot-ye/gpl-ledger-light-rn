module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: aliasFromTsconfig(),
      },
    ],
  ],
};

function aliasFromTsconfig() {
  const content = require('fs').readFileSync('./tsconfig.json', 'utf8');
  const JSON5 = require('json5');
  /** @type {import("./tsconfig.json")} */
  const tsconfig = JSON5.parse(content);
  const paths = tsconfig.compilerOptions.paths;
  const alias = {};
  Object.keys(paths).forEach(key => {
    const _key = key.replace(/\/\*/g, '');
    alias[_key] = './' + paths[key][0].replace(/\/\*/g, '');
  });
  return alias;
}
