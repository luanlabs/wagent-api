const { spawn } = require('node:child_process');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { createServer } = require('node:net');
const { once } = require('node:events');

module.exports = async function startMongo() {
  const portProbe = createServer();
  await new Promise((resolve, reject) => {
    portProbe.once('error', reject);
    portProbe.listen(0, '127.0.0.1', resolve);
  });
  const port = portProbe.address().port;
  await new Promise((resolve) => portProbe.close(resolve));
  const dir = await mkdtemp(join(tmpdir(), 'wagent-mongo-test-'));

  const child = spawn(
    process.env.MONGOD_BIN || 'mongod',
    [
      '--dbpath',
      dir,
      '--port',
      String(port),
      '--bind_ip',
      '127.0.0.1',
      '--nounixsocket',
      '--quiet',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );

  const stop = async () => {
    if (child.pid && child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit');
      child.kill('SIGTERM');
      const timeout = setTimeout(() => child.kill('SIGKILL'), 5000);
      await exited;
      clearTimeout(timeout);
    }
    await rm(dir, { recursive: true, force: true });
  };

  try {
    await new Promise((resolve, reject) => {
      let output = '';
      const timeout = setTimeout(
        () => reject(new Error(`MongoDB startup timed out: ${output}`)),
        15_000,
      );
      const complete = (error) => {
        clearTimeout(timeout);
        if (error) reject(error);
        else resolve();
      };
      child.once('error', (error) =>
        complete(new Error(`Install mongod or set MONGOD_BIN: ${error.message}`)),
      );
      child.once('exit', (code) => complete(new Error(`MongoDB exited (${code}): ${output}`)));
      const read = (chunk) => {
        output = (output + chunk).slice(-8000);
        if (output.includes('Waiting for connections')) complete();
      };
      child.stdout.on('data', read);
      child.stderr.on('data', read);
    });
  } catch (error) {
    await stop();
    throw error;
  }

  return { uri: `mongodb://127.0.0.1:${port}`, stop };
};
