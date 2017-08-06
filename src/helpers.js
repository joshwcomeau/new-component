/*
Helpers are application-specific functions.

They're useful for abstracting away plumbing and other important-but-
uninteresting parts of the code, specific to this codebase.

NOTE: For generalized concerns that aren't specific to this project,
use `utils.js` instead.
*/
const os = require('os');

const prettier = require('prettier');

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
    type: 'class',
    dir: 'src/components',
    extension: 'js'
  };

  const globalOverrides = requireOptional(`/${home}/.add-component.json`);

  const localOverrides = requireOptional(`/${currentPath}/.add-component.json`);


  return Object.assign({}, globalOverrides, localOverrides, defaults);
}

module.exports.buildPrettifier = prettierConfig => text => (
  prettier.format(text, prettierConfig)
);
