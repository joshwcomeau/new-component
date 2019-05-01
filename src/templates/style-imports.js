const { stylingTypes } = require('../helpers');

module.exports = (style, componentName) => {
  switch (style) {
    case stylingTypes.STYLED:
      return "import styled from 'styled-components';";

    case stylingTypes.CSS_MODULES:
      return `import styles from './${componentName}.css';`;

    case stylingTypes.APHRODITE:
      return "import { StyleSheet, css } from 'aphrodite';";

    default:
      return '';
  }
}
