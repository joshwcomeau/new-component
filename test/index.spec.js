const path = require('path');
const execa = require('execa');
const CLI_PATH = path.resolve(__dirname, '../src/index.js');

const clearComponentsDirectory = () => execa.sync('rm', ['-rf', './src/components']);

describe('echo CLI test', () => {
  it('should be able to read stdout', done => {
    execa('echo', ['unicorns']).then(result => {
      expect(result.stdout).toEqual('unicorns');
      done();
    });
  });
});

describe('new-component - help', () => {
  it('should accept --help argument ASYNC', done => {
    // example test using async execa
    execa(CLI_PATH, ['--help']).then(result => {
      expect(result.stdout).toMatchSnapshot();
      expect(result.stdout).toContain('-t, --type <componentType>');
      done();
    });
  });
  it('should accept --help argument SYNC', () => {
    // example test using sync execa
    const { code, stdout } = execa.sync(CLI_PATH, ['--help']);
    expect(code).toBe(0);
    expect(stdout).toMatchSnapshot();
  })
});

describe('new-component - creating a new component', () => {
  beforeEach(clearComponentsDirectory);
  afterEach(clearComponentsDirectory);
  it('should show console error if no components folder', () => {
    const { code, stdout } = execa.sync(CLI_PATH, ['CoolButton']);
    expect(code).toBe(0);
    expect(stdout).toContain('Sorry, you need to create a parent \"components\" directory.');
    expect(stdout).toMatchSnapshot();
  });
  it('should create a new component file for CoolButton', () => {
    execa.sync('mkdir', ['./src/components']);
    const { code, stdout } = execa.sync(CLI_PATH, ['CoolButton']);
    const expectedPath = 'src/components/CoolButton/CoolButton.js';
    const pathToNewComponent = path.resolve('./' + expectedPath);
    expect(pathToNewComponent).toContain(expectedPath);
    expect(code).toBe(0);
    expect(stdout).toMatchSnapshot();
    expect(stdout).toContain('Creating the CoolButton component');
  });
})
