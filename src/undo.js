#!/usr/bin/env node
const readline = require('readline');
const tty = require('tty');
const chalk = require('chalk');

const {
  getConfig,
  logUndoConfirmation,
  logUndoConclusion
} = require('./helpers');
const {
  readDirPromise,
  rimrafPromise,
  statPromise
} = require('./utils');

const config = getConfig();

// Delete component directory
readDirPromise(config.dir).then(files => {
  if (files.length === 0) {
    console.log(`There\'s no files in ${config.dir}! Is this where your components
      are located?`);
    process.exit(0);
  }

  let lastCreatedFile = { name: '', dateModified: 0 };

  // Create promises to check which component was created last
  const filePromises = files.map(name => {
    return statPromise(`${config.dir}/${name}`).then(fileStat => {
      const dateModified = fileStat.mtime.getTime();
      if (lastCreatedFile.dateModified < dateModified) {
        lastCreatedFile = { name, dateModified };
      }
    });
  });

  // Invoke promises and get last modified component
  Promise.all(filePromises).then(() => {
    const componentName = lastCreatedFile.name;
    // Log the intro
    logUndoConfirmation(componentName);
    // Ask for key press and delete the component
    askAndDelete(componentName);
  })
}).catch(err => {
  if (err.code === 'ENOENT') {
    console.log(`Sorry, we couldn't find ${config.dir}.`);
    console.log(`Did you mean ${chalk.bold`new-component`}?`);
    process.exit(0);
  }
  console.error(err)
  process.exit(0);
});

function askAndDelete(componentName) {
  // Setup node cli prompt
  readline.emitKeypressEvents(process.stdin);
  if (typeof process.stdin.setRawMode == 'function') {
    process.stdin.setRawMode(true);
  } else {
    tty.setRawMode(true);
  }
  process.stdin.resume();
  process.stdin.on('keypress', function(str, key) {
    if (key && key.name !== 'return') process.exit(0);

    // Delete component directory
    rimrafPromise(`${config.dir}/${componentName}`)
      .then(() => {
        logUndoConclusion(componentName);
        process.exit(0);
      })
      .catch(err => {
        console.error(err);
      });
  })
}
