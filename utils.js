const fs = require('fs');
const path = require('path');


module.exports.requireOptional = (filePath) => {
  try {
    return require(filePath);
  } catch (e) {
    // We want to ignore 'MODULE_NOT_FOUND' errors, since all that means is that
    // the user has not set up a global overrides file.
    // All other errors should be thrown as expected.
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e;
    }
  }
}

// Somewhat counter-intuitively, `fs.readFile` works relative to the current
// working directory (if the user is in their own project, it's relative to
// their project). This is unlike `require()` calls, which are always relative
// to the code's directory.
//
// We want to open our various template files as text, so that we can modify
// their contents. Because of this, we need this helper
//
// We'll also use promises, because why not.
module.exports.readFileRelative = fileLocation => (
  new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, fileLocation), 'utf-8', (err, text) => {
      err ? reject(err) : resolve(text);
    });
  })
);

module.exports.writeFileRelative = (fileLocation, fileContents) => (
  new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(__dirname, fileLocation),
      fileContents,
      'utf-8',
      (err, text) => err ? reject(err) : resolve(text)
    )
  })
);
