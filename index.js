#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const os = require('os');

const program = require('commander');

// Load our package.json, so that we can pass the version onto `commander`.
const {version} = require('./package.json');

const rootPath = path.resolve();

program
  .version(version)
  .arguments('<filename>')
  .option(
    '-t, --type <componentType>',
    'Type of React component to generate',
    /^(class|pureClass|functional)$/i,
    'class'
  ).option(
    '-s, --style <style>',
    'Type of styles to use',
    /^(css-modules|aphrodite|styled-components|emotion)$/i
  );
