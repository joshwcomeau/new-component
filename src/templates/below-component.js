const { stylingTypes } = require('../helpers');

const styled = `\
const Wrapper = styled.div\`
\`;
`;

const aphrodite = `\
const styles = StyleSheet.create({
  wrapper: {
  },
});
`;

module.exports = (style, componentType) => {
  switch (style) {
    case stylingTypes.STYLED:
      return styled;

    case stylingTypes.APHRODITE:
      return aphrodite;

    default:
      return '';
  }
}
