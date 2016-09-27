'use strict';

const externals = {};

externals.error = {
  //[Error: Client request error: getaddrinfo ENOTFOUND example.og example.og:80]
  code: 'ENOTFOUND',
  errno: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'example.og',
  host: 'example.og',
  port: 80,
  trace: [ { method: 'GET', url: 'http://example.og/example.htm' } ],
  isBoom: true,
  isServer: true,
  data: null,
  output: {
    statusCode: 502,
    payload: { 
      statusCode: 502,
      error: 'Bad Gateway',
      message: 'getaddrinfo ENOTFOUND example.og example.og:80'
    },
    headers: {}
  },
  reformat: [Function]
};

module.exports = externals;
