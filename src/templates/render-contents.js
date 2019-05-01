const { stylingTypes } = require('../helpers');

module.exports = (style) => {
  switch (style) {
    case stylingTypes.STYLED:
      return '<Wrapper />';

    case stylingTypes.CSS_MODULES:
      return '<div className={styles.wrapper} />';

    case stylingTypes.APHRODITE:
      return '<div className={css(styles.wrapper)} />';

    default:
      return '<div />';
  }
}
