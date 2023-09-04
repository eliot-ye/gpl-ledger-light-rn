module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'react-native/no-inline-styles': 0,
        'react/no-unstable-nested-components': 0,
        'react-hooks/rules-of-hooks': 0,
      },
    },
  ],
};
