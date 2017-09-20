#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const program = require('commander');

const {
  getConfig,
  buildPrettifier,
  logIntro,
  logItemCompletion,
  logConclusion,
  logError,
  hasCssFile,
} = require('./helpers');
const {
  requireOptional,
  mkDirPromise,
  readFilePromiseRelative,
  writeFilePromise,
} = require('./utils');
const generateTemplate = require('./helpers/templateConstructor');
const cssTemplate = require('./templates/css');

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require('../package.json');

// Get the default config for this component (looks for local/global overrides,
// falls back to sensible defaults).
const config = getConfig();

// Convenience wrapper around Prettier, so that config doesn't have to be
// passed every time.
const prettify = buildPrettifier(config.prettierConfig);
const prettifyCss = buildPrettifier(Object.assign({}, config.prettierConfig, {
  parser: 'postcss'
}));


program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-t, --type <componentType>',
    'Type of React component to generate (default: "class")',
    /^(class|pure-class|functional)$/i,
    config.type
  ).option(
    '-s, --styling <stylingSolution>',
    'Which styling solution to generate for (default: "none")',
    /^(none|styled-components|css-modules|aphrodite)$/i,
    config.styling
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

// Get all of our file paths worked out, for the user's project.
const componentDir = `${program.dir}/${componentName}`;
const componentFilePath = `${componentDir}/${componentName}.${program.extension}`;
const cssFilePath = `${componentDir}/${componentName}.${'css'}`;
const indexPath = `${componentDir}/index.js`;

// Our index template is super straightforward, so we'll just inline it for now.
const indexTemplate = `\
export { default } from './${componentName}';
`;

logIntro({
  name: componentName,
  dir: componentDir,
  type: program.type,
  styling: program.styling,
});


// Check if componentName is provided
if (!componentName) {
  logError(`Sorry, you need to specify a name for your component like this: new-component <name>`)
  process.exit(0);
}

// Check to see if a directory at the given path exists
const fullPathToParentDir = path.resolve(program.dir);
if (!fs.existsSync(fullPathToParentDir)) {
  logError(`Sorry, you need to create a parent "components" directory.\n(new-component is looking for a directory at ${program.dir}).`)
  process.exit(0);
}

// Check to see if this component has already been created
const fullPathToComponentDir = path.resolve(componentDir);
if (fs.existsSync(fullPathToComponentDir)) {
  logError(`Looks like this component already exists! There's already a component at ${componentDir}.\nPlease delete this directory and try again.`)
  process.exit(0);
}

// Start by creating the directory that our component lives in.
mkDirPromise(componentDir)
  .then(() => (
    generateTemplate(componentName, program.type, program.styling)
  ))
  .then(template => {
    logItemCompletion('Directory created.');
    return template;
  })
  .then(template => (
    // Format it using prettier, to ensure style consistency, and write to file.
    writeFilePromise(componentFilePath, prettify(template))
  ))
  .then(() => {
    // Check whether we should make a CSS file too
    if (hasCssFile(program.styling)) {
      // Format it using prettier, to ensure style consistency, and write to file.
      return writeFilePromise(cssFilePath, prettifyCss(cssTemplate))
        .then(() => {
          logItemCompletion('CSS file built and saved to disk.');
        });
    }
  })
  .then(() => {
    logItemCompletion('Component built and saved to disk.');
  })
  .then(() => (
    // We also need the `index.js` file, which allows easy importing.
    writeFilePromise(indexPath, prettify(indexTemplate))
  ))
  .then(() => {
    logItemCompletion('Index file built and saved to disk.');
  })
  .then(() => {
    logConclusion();
  })
  .catch(err => {
    console.error(err);
  })
