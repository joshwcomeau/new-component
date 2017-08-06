#!/usr/bin/env node
const fs = require('fs');

const program = require('commander');
const prettier = require('prettier');

const {
  requireOptional,
  readFilePromiseRelative,
  writeFilePromise,
} = require('./utils');
const { getConfig, buildPrettifier } = require('./helpers');

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require('./package.json');

// Get the default config for this component (looks for local/global overrides,
// falls back to sensible defaults).
const config = getConfig();

// Convenience wrapper around Prettier, so that config doesn't have to be
// passed every time.
const prettify = buildPrettifier(config.prettierConfig);

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-t, --type <componentType>',
    'Type of React component to generate (default: "class")',
    /^(class|pureClass|functional)$/i,
    config.type
  ).option(
    '-d, --dir <pathToDirectory>',
    'Path to the "components" directory (default: "src/components")',
    config.dir
  ).option(
    '-x, --extension <fileExtension>',
    'Which file extension to use for the component (default: "js")',
    config.extension
  ).parse(process.argv);


const [componentName] = program.args;

const templatePath = `./templates/${program.type}.js`;

// Create our new working directory.
const componentDir = `${program.dir}/${componentName}`;
fs.mkdirSync(componentDir);

const filePath = `${componentDir}/${componentName}.${program.extension}`;

const indexPath = `${componentDir}/index.js`;
const indexTemplate = prettify(`\
export { default } from './${componentName}';
`);

readFilePromiseRelative(templatePath)
  .then(template => (
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/COMPONENT_NAME/g, componentName)
  ))
  .then(template => (
    // Format it using prettier, to ensure style consistency, and write to file.
    writeFilePromise(filePath, prettify(template))
  ))
  .then(template => (
    // We also need the `index.js` file, which allows easy importing.
    writeFilePromise(indexPath, prettify(indexTemplate))
  ))
  .catch(err => {
    console.error(err);
  })
