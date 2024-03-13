#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const { program } = require("commander");

const {
  getConfig,
  buildPrettifier,
  createParentDirectoryIfNecessary,
  logIntro,
  logItemCompletion,
  logConclusion,
  logError
} = require("./helpers");
const {
  mkDirPromise,
  readFilePromiseRelative,
  writeFilePromise
} = require("./utils");

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require("../package.json");

// Get the default config for this component (looks for local/global overrides,
// falls back to sensible defaults).
const config = getConfig();

// Convenience wrapper around Prettier, so that config doesn't have to be
// passed every time.
const prettify = buildPrettifier(config.prettierConfig);

program
  .version(version)
  .arguments("<componentName>")
  .option(
    "-l, --lang <language>",
    'Which language to use (default: "js")',
    /^(js|ts)$/i,
    config.lang
  )
  .option(
    "-d, --dir <pathToDirectory>",
    'Path to the "components" directory (default: "src/components")',
    config.dir
  )
  .parse(process.argv);

const componentName =
  program.args[0].charAt(0).toLowerCase() + program.args[0].slice(1);

const options = program.opts();

console.log(options);
const fileExtension = options.lang === "js" ? "jsx" : "tsx";
const indexExtension = options.lang === "js" ? "js" : "ts";

// Find the path to the selected template file.
const componentTemplatePath = `./templates/component.js`;
const indexTemplatePath = `./templates/index.js`;

// Get all of our file paths worked out, for the user's project.
const componentDir = `${options.dir}/${componentName}`;
const filePathComponent = `${componentDir}/${componentName}.${fileExtension}`;
const filePathIndex = `${componentDir}/index.${fileExtension}`;

logIntro({
  name: componentName,
  dir: componentDir,
  lang: options.lang
});

// Check if componentName is provided
if (!componentName) {
  logError(
    `Sorry, you need to specify a name for your component like this: new-component <name>`
  );
  process.exit(0);
}

// Check to see if the parent directory exists.
// Create it if not
createParentDirectoryIfNecessary(options.dir);

// Check to see if this component has already been created
const fullPathToComponentDir = path.resolve(componentDir);
if (fs.existsSync(fullPathToComponentDir)) {
  logError(
    `Looks like this component already exists! There's already a component at ${componentDir}.\nPlease delete this directory and try again.`
  );
  process.exit(0);
}

mkDirPromise(componentDir)
  .then(() => readFilePromiseRelative(componentTemplatePath))
  .then(template => {
    logItemCompletion("Directory created.");
    return template;
  })
  .then(template =>
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(
      /COMPONENT_NAME_CAP/g,
      componentName[0].toUpperCase() + componentName.slice(1)
    )
  )
  .then(template =>
    // Format it using prettier, to ensure style consistency, and write to file.
    writeFilePromise(filePathComponent, prettify(template))
  )
  .then(() => {
    logItemCompletion("Component built and saved to disk.");
  })
  .then(() => readFilePromiseRelative(indexTemplatePath))
  .then(template =>
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(
      /COMPONENT_NAME_CAP/g,
      componentName[0].toUpperCase() + componentName.slice(1)
    )
  )
  .then(template =>
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/COMPONENT_NAME/g, componentName)
  )
  .then(template =>
    // Format it using prettier, to ensure style consistency, and write to file.
    writeFilePromise(filePathIndex, prettify(template))
  )
  .then(() => {
    logItemCompletion("Index file built and saved to disk.");
  })
  .then(() => {
    logConclusion();
  })
  .catch(err => {
    console.error(err);
  });
