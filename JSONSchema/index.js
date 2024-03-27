const fs = require('fs');
const {resolve} = require('path');
const TJS = require('typescript-json-schema');

/** @type {TJS.PartialArgs} */
const settings = {
  required: true,
  ignoreErrors: true,
};

/** @type {TJS.CompilerOptions} */
const compilerOptions = {
  strictNullChecks: true,
};

const program = TJS.getProgramFromFiles(
  [resolve('types.d.ts')],
  compilerOptions,
);

const schemaList = ['SControlJSON', 'SVersionList'];

schemaList.forEach(schemaName => {
  const schema = TJS.generateSchema(program, schemaName, settings);
  fs.writeFileSync(
    resolve(`../public/${schemaName}.json`),
    JSON.stringify(schema),
  );
});
