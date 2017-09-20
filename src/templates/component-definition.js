const { componentTypes } = require('../helpers');

const functional = (ComponentName, renderContents) => (`
const ${ComponentName} = () => {
  return ${renderContents};
};
`)

const classComp = (ComponentName, renderContents) => (`
class ${ComponentName} extends Component {
  render() {
    return ${renderContents};
  }
}
`)

const pureClass = (ComponentName, renderContents) => (`
class ${ComponentName} extends PureComponent {
  render() {
    return ${renderContents};
  }
}
`)

module.exports = (componentType, ...args) => {
  switch (componentType) {
    case componentTypes.FUNCTIONAL:
      return functional(...args);

    case componentTypes.CLASS:
      return classComp(...args);

    case componentTypes.PURE_CLASS:
      return pureClass(...args);
  }
}
