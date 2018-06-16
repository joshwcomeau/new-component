var spawnCommand = require('spawn-command');

const CLI_PATH = require.resolve('../src/index');

describe('test', () => {
  it('should accept --help argument', done => {
    child = spawnCommand(CLI_PATH + ' --help');

    child.stdout.on('data', function (data) {
      expect(data.toString()).toContain('-t, --type <componentType>');
    });

    child.on('exit', function (exitCode) {
      expect(exitCode).toEqual(0);
      done(); // must always call on exit to test async code
    });
  })
});
