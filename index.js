#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const os = require('os');

const program = require('commander');

const {requireOptional} = require('./utils');

// Load our package.json, so that we can pass the version onto `commander`.
const {version} = require('./package.json');

// Check to see if there are any global or local overrides.
const home = os.homedir();
const currentPath = path.resolve();

const globalOverrides = requireOptional(`/${home}/.add-component.json`);
const localOverrides = requireOptional(`/${currentPath}/.add-component.json`);

const defaults = Object.assign({}, globalOverrides, localOverrides, {
  type: 'class',
});

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-t, --type <componentType>',
    'Type of React component to generate',
    /^(class|pureClass|functional)$/i,
    defaults.type
  ).option(
    '-s, --style <style>',
    'Type of styles to use',
    /^(css-modules|aphrodite|styled-components|emotion)$/i,
    defaults.style
  ).parse(process.argv);
