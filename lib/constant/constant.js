'use strict';

const logLevel = {
  DEBUG : 'DEBUG',
  ERROR : 'ERROR',
  FATAL : 'FATAL',
  INFO : 'INFO',
  OFF : 'OFF',
  TRACE : 'TRACE',
  WARN : 'WARN'
};

module.exports.logLevel = Object.freeze(logLevel);
