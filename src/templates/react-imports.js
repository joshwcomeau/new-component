const { componentTypes } = require('../helpers');

module.exports = (componentType) => {
  switch (componentType) {
    case componentTypes.FUNCTIONAL:
      return "import React from 'react';";

    case componentTypes.CLASS:
      return "import React, { Component } from 'react';";

    case componentTypes.PURE_CLASS:
      return "import React, { PureComponent } from 'react';";
  }
}
