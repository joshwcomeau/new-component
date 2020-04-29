/*
Helpers are application-specific functions.

They're useful for abstracting away plumbing and other important-but-
uninteresting parts of the code, specific to this codebase.

NOTE: For generalized concerns that aren't specific to this project,
use `utils.js` instead.
*/
const os = require('os');

const prettier = require('prettier');
const chalk = require('chalk');

const { requireOptional } = require('./utils');

// Get the configuration for this component.
// Overrides are as follows:
//  - default values
//  - globally-set overrides
//  - project-specific overrides
//  - command-line arguments.
//
// The CLI args aren't processed here; this config is used when no CLI argument
// is provided.
module.exports.getConfig = () => {
  const home = os.homedir();
  const currentPath = process.cwd();

  const defaults = {
    type: 'functional',
    dir: 'src/components',
    extension: 'js',
  };

  const globalOverrides = requireOptional(
    `/${home}/.new-component-config.json`
  );

  const localOverrides = requireOptional(
    `/${currentPath}/.new-component-config.json`
  );

  return Object.assign({}, globalOverrides, localOverrides, defaults);
};

module.exports.buildPrettifier = (prettierConfig) => (text) =>
  prettier.format(text, prettierConfig);

// Emit a message confirming the creation of the component
const colors = {
  red: [216, 16, 16],
  green: [142, 215, 0],
  blue: [0, 186, 255],
  gold: [255, 204, 0],
  mediumGray: [128, 128, 128],
  darkGray: [90, 90, 90],
};

const logComponentType = (selected) =>
  ['class', 'pure-class', 'functional']
    .sort((a, b) => (a === selected ? -1 : 1))
    .map((option) =>
      option === selected
        ? `${chalk.bold.rgb(...colors.blue)(option)}`
        : `${chalk.rgb(...colors.darkGray)(option)}`
    )
    .join('  ');

module.exports.logIntro = ({ name, dir, type }) => {
  console.info('\n');
  console.info(
    `✨  Creating the ${chalk.bold.rgb(...colors.gold)(name)} component ✨`
  );
  console.info('\n');

  const pathString = chalk.bold.rgb(...colors.blue)(dir);
  const typeString = logComponentType(type);

  console.info(`Directory:  ${pathString}`);
  console.info(`Type:       ${typeString}`);
  console.info(
    chalk.rgb(...colors.darkGray)('=========================================')
  );

  console.info('\n');
};

module.exports.logItemCompletion = (successText) => {
  const checkmark = chalk.rgb(...colors.green)('✓');
  console.info(`${checkmark} ${successText}`);
};

module.exports.logConclusion = () => {
  console.info('\n');
  console.info(chalk.bold.rgb(...colors.green)('Component created! 🚀 '));
  console.info(
    chalk.rgb(...colors.mediumGray)('Thanks for using new-component.')
  );
  console.info('\n');
};

module.exports.logError = (error) => {
  console.info('\n');
  console.info(chalk.bold.rgb(...colors.red)('Error creating component.'));
  console.info(chalk.rgb(...colors.red)(error));
  console.info('\n');
};
