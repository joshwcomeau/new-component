const { stylingTypes } = require('../helpers');

module.exports = (style, componentName) => {
  switch (style) {
    default:
      return `export default ${componentName};`;
  }
}
