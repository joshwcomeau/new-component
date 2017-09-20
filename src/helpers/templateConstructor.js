const reactImportTemplates = require('../templates/react-imports');
const styleImportTemplates = require('../templates/style-imports');
const renderContentTemplates = require('../templates/render-contents');
const componentDefinitionTemplates = require('../templates/component-definition');
const belowComponentTemplates = require('../templates/below-component');
const exportsTemplates = require('../templates/exports');

module.exports = (componentName, componentType, style) => {
  const renderContents = renderContentTemplates(style);
  const template = `
  ${reactImportTemplates(componentType)}
  ${styleImportTemplates(style, componentName)}

  ${componentDefinitionTemplates(componentType, componentName, renderContents)}

  ${belowComponentTemplates(style)}

  ${exportsTemplates(style, componentName)}
  `;

  return template;
}

