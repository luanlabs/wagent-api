const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, readFileSync, existsSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { test } = require('node:test');

const env = require('./helpers/env.cjs');

for (const mode of ['production', 'development']) {
  test(`${mode}: all log levels reach stdout${mode === 'production' ? ' and the file' : ''}`, (t) => {
    const dir = mkdtempSync(join(tmpdir(), 'wagent-logger-test-'));
    t.after(() => rmSync(dir, { recursive: true, force: true }));
    const logPath = join(dir, 'api.log');
    const result = spawnSync(
      process.execPath,
      [
        '-e',
        `
          const { finished } = require('node:stream/promises');
          const log = require('./dist/config/logger').default;
          for (const level of ['trace', 'debug', 'info', 'warn', 'error', 'fatal']) {
            log[level]({ check: level }, 'log test');
          }
          log.error({ err: new Error('test stack') }, 'error details');
          Promise.all(log.streams.filter(s => s.path).map(s => {
            const done = finished(s.stream);
            s.stream.end();
            return done;
          })).catch(err => { console.error(err); process.exitCode = 1; });
        `,
      ],
      {
        env: { ...process.env, ...env, NODE_ENV: mode, LOG_FILE_PATH: logPath },
        encoding: 'utf8',
        timeout: 10_000,
      },
    );

    assert.equal(result.status, 0, result.stderr || result.error?.message);
    const records = result.stdout.trim().split('\n').map(JSON.parse);
    assert.equal(records.length, 7);
    assert.deepEqual(
      records.slice(0, 6).map((r) => r.level),
      [10, 20, 30, 40, 50, 60],
    );
    assert.ok(records[6].err.stack.includes('test stack'));
    assert.ok(records.every((r) => r.name === 'WAGENT_API'));

    if (mode === 'production') {
      assert.deepEqual(readFileSync(logPath, 'utf8').trim().split('\n').map(JSON.parse), records);
      assert.ok(records.every((r) => r.src === undefined));
    } else {
      assert.equal(existsSync(logPath), false);
      assert.ok(records.every((r) => r.src));
    }
  });
}
