const http = require('node:http');
const { argv } = require('node:process');

const port = argv[2];
const host = argv[3];

const options = {
  timeout: 2000,
  host,
  port,
  path: '/health-check',
};

const request = http.request(options, (res) => {
  console.info(`STATUS: ${res.statusCode}`);
  process.exitCode = res.statusCode === 200 ? 0 : 1;
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
});

request.on('error', (err) => {
  console.error('ERROR', err);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});

request.end();
