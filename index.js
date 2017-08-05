#!/usr/bin/env node
const os = require('os');
const fs = require('fs');

const program = require('commander');
const prettier = require('prettier');

const {
  requireOptional,
  readFileRelative,
  writeFileRelative,
} = require('./utils');

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require('./package.json');

// Check to see if there are any global or local overrides.
const home = os.homedir();
const currentPath = process.cwd();

const globalOverrides = requireOptional(`/${home}/.add-component.json`);
const localOverrides = requireOptional(`/${currentPath}/.add-component.json`);

const options = Object.assign({}, globalOverrides, localOverrides, {
  type: 'class',
  dir: 'src/components',
  extension: 'js'
});

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-t, --type <componentType>',
    'Type of React component to generate (default: "class")',
    /^(class|pureClass|functional)$/i,
    options.type
  ).option(
    '-s, --style <style>',
    'Type of styles to use (default: null)',
    /^(css-modules|aphrodite|styled-components|emotion)$/i,
    options.style
  ).option(
    '-d, --dir <pathToDirectory>',
    'Path to the "components" directory (default: "src/components")',
    options.dir
  ).option(
    '-x, --extension <fileExtension>',
    'Which file extension to use for the component (default: "js")',
    options.extension
  ).parse(process.argv);


const [componentName] = program.args;

const templatePath = `./templates/${program.type}.js`;

// Create our new working directory.
const componentDir = `${program.dir}/${componentName}`;
fs.mkdirSync(componentDir);

const filePath = `${componentDir}/${componentName}.${program.extension}`;


readFileRelative(templatePath)
  .then(template => (
    template.replace(/COMPONENT_NAME/g, componentName)
  ))
  .then(template => (
    prettier.format(template, options.prettierConfig)
  ))
  .then(template => new Promise((resolve, reject) => {
    fs.writeFile(filePath, template, 'utf-8', (err) => {
      err ? reject(err) : resolve();
    })
  }))
  .catch(err => {
    console.error(err);
  })
