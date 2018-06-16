var spawnCommand = require('spawn-command');

const CLI_PATH = require.resolve('../src/index');

describe('new-component CLI', () => {
  it('should accept --help argument', done => {
    child = spawnCommand(CLI_PATH + ' --help');

    child.stdout.on('data', function (data) {
      const output = data.toString();
      expect(output).toMatchSnapshot();
      expect(output).toContain('-t, --type <componentType>');
    });

    child.on('exit', function (exitCode) {
      expect(exitCode).toEqual(0);
      done(); // must always call on exit to test async code
    });
  })
});
