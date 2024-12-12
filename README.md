<p align="center">
  <img src="https://github.com/joshwcomeau/new-component/blob/main/docs/logo@2x.png?raw=true" width="285" height="285" alt="new-component logo">
  <br>
  <a href="https://www.npmjs.org/package/new-component"><img src="https://img.shields.io/npm/v/new-component.svg?style=flat" alt="npm"></a>
</p>

# new-component

### Simple, customizable utility for adding new React components to your project.

<img src="https://github.com/joshwcomeau/new-component/blob/main/docs/divider@2x.png?raw=true" width="888" height="100" role="presentation">

This project is a CLI tool that allows you to quickly scaffold new components. All of the necessary boilerplate will be generated automatically.

This project uses an opinionated file structure discussed in this blog post: [**Delightful React File/Directory Structure**](https://www.joshwcomeau.com/react/file-structure/).

> **NOTE: This project is not actively maintained.** I continue to use it in my own projects, but I don't have the bandwidth to review PRs or triage issues. Feel free to fork this project and tweak it however you wish. ❤️

<br />

## Features

- Simple CLI interface for adding React components.
- Uses [Prettier](https://github.com/prettier/prettier) to stylistically match the existing project.
- Offers global config, which can be overridden on a project-by-project basis.
- Colourful terminal output!

<br />

> **Version 5:** The new version adds support for TypeScript, and removes support for passing a custom file extension;

## Quickstart

Install via NPM:

```bash
# Using Yarn:
$ yarn global add new-component

# or, using NPM
$ npm i -g new-component
```

`cd` into your project's directory, and try creating a new component:

```bash
$ new-component MyNewComponent
```

Your project will now have a new directory at `src/components/MyNewComponent`. This directory has two files:

```jsx
// `MyNewComponent/index.js`
export { default } from './MyNewComponent';
```

```jsx
// `MyNewComponent/MyNewComponent.js`
import React from 'react';

function MyNewComponent() {
  return <div></div>;
}

export default MyNewComponent;
```

These files will be formatted according to your Prettier configuration.

<br />

## Configuration

Configuration can be done through 3 different ways:

- Creating a global `.new-component-config.json` in your home directory (`~/.new-component-config.json`).
- Creating a local `.new-component-config.json` in your project's root directory.
- Command-line arguments.

The resulting values are merged, with command-line values overwriting local values, and local values overwriting global ones.

<br />

## API Reference

### Language

Controls which language, JavaScript or TypeScript, should be used.

- `js` — creates a `.jsx` file (default).
- `ts` — creates a `.tsx` file.

As of Version 6, JavaScript files always have the `.jsx` extension, since Vite doesn’t tolerate JSX inside `.js` files. If you wish to keep generating `.js` files, you can use Version 5, or fork this project and change [this line](https://github.com/joshwcomeau/new-component/blob/main/src/index.js#L54).

**Usage:**

Command line: `--lang <value>` or `-l <value>`

JSON config: `{ "lang": <value> }`
<br />

### Directory

Controls the desired directory for the created component. Defaults to `src/components`

**Usage:**

Command line: `--dir <value>` or `-d <value>`

JSON config: `{ "dir": <value> }`
<br />

## Platform Support

This has only been tested in macOS. I think it'd work fine in linux, but I haven't tested it. Windows is a big question mark.
<br />

## Known Issues

If you try to use this package with the Next.js App Router, you’ll run into an error:

```md
**Syntax error:** the name `default` is exported multiple times
```

This issue is described in depth in [my blog post about this package](https://joshwcomeau.com/react/file-structure/#issues-with-the-app-router). To solve this problem, you’ll need to fork this library and remove [the wildcard export](https://github.com/joshwcomeau/new-component/blob/main/src/index.js#L67).

## Development

To get started with development:

- Fork and clone the Git repo
- `cd` into the directory and install dependencies (`yarn install` or `npm install`)
- Set up a symlink by running `npm link`, while in the `new-component` directory. This will ensure that the `new-component` command uses this locally-cloned project, rather than the global NPM installation.
- Spin up a test React project.
- In that test project, use the `new-component` command to create components and test that your changes are working.
