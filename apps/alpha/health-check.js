const http = require('node:http');

const options = {
  timeout: 2000,
  host: 'localhost',
  port: 5000,
  path: '/health-check', // must be the same as HEALTHCHECK in Dockerfile
};

const request = http.request(options, res => {
  console.info(`STATUS: ${res.statusCode}`);
  process.exitCode = res.statusCode === 200 ? 0 : 1;
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
});

request.on('error', err => {
  console.error('ERROR', err);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});

request.end();
