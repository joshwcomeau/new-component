#!/usr/bin/env node
const os = require('os');

const program = require('commander');
const prettier = require('prettier');

const { requireOptional, readFileRelative } = require('./utils');

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require('./package.json');

// Check to see if there are any global or local overrides.
const home = os.homedir();
const currentPath = process.cwd();

const globalOverrides = requireOptional(`/${home}/.add-component.json`);
const localOverrides = requireOptional(`/${currentPath}/.add-component.json`);

const options = Object.assign({}, globalOverrides, localOverrides, {
  type: 'class',
  pathToDirectory: "src/components",
});

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-t, --type <componentType>',
    'Type of React component to generate',
    /^(class|pureClass|functional)$/i,
    options.type
  ).option(
    '-s, --style <style>',
    'Type of styles to use',
    /^(css-modules|aphrodite|styled-components|emotion)$/i,
    options.style
  ).option(
    '-d, --dir <pathToDirectory>',
    'Path to the "components" directory',
    options.pathToDirectory
  ).parse(process.argv);


const [componentName] = program.args;

const templatePath = `./templates/${program.type}.js`;

readFileRelative(templatePath)
  .then(template => (
    template.replace(/COMPONENT_NAME/g, componentName)
  ))
  .then(template => (
    prettier.format(template, options.prettierConfig)
  ))
  .then(template => (
    console.log(template)
  ))
  .catch(err => {
    console.error(err);
  })
