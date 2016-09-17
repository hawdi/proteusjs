'use strict';

const chalk = require('chalk');
const log = console.log;
chalk.enabled = true;

const WreckLogUtil = require('./wrecklogutil');

class WreckMonitor {
  constructor(wreck, options) {

    log(`${new Date().toISOString()} - ${chalk.cyan('[proteusjs]')} : initializing wreck monitor`);

    this.settings = options;

    const opts = options || {};
    this.registerEvents(wreck);

    log(`${new Date().toISOString()} - ${chalk.cyan('[proteusjs]')} : wreck monitor initialization completed`);
  }

  push (value) {

    let  result = value();
    result = JSON.stringify(result);
    result = JSON.parse(result);

    this.settings.reporter.console.wreck && this.settings.reporter.consoleReporter.emit('consolelog', result);

  };

  registerEvents(wreck){
    let wreckRequest;
    let wreckResponse;

    // wreck request register
    wreck.on('request', (req) => {
      //stringify req headers
      const strReq = JSON.stringify(req);
      const jsonReq = JSON.parse(strReq);

      this.push(() => new WreckLogUtil.WreckRequestLog(jsonReq));

    });

    //wreck response event
    wreck.on('response', (err, req, res, start, uri) => {

      let cache = [];

      const strRes = JSON.stringify(res, function(key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
          }
          // Store value in our collection
          cache.push(value);
        }
        return value;
      });

      cache = null; // Enable garbage collection
      const jsonRes = JSON.parse(strRes);

      this.push(() => new WreckLogUtil.WreckResponseLog(jsonRes));

    });
  }
}

module.exports = WreckMonitor;
