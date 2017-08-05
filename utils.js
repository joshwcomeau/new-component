module.exports.requireOptional = (path) => {
  try {
    return require(path);
  } catch (e) {
    // We want to ignore 'MODULE_NOT_FOUND' errors, since all that means is that
    // the user has not set up a global overrides file.
    // All other errors should be thrown as expected.
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e;
    }
  }
}
