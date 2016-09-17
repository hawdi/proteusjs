'use strict';

const events = require('events');

const consoleEmitter = new events.EventEmitter();
let settings = {};

consoleEmitter.on('consolelog', (log) => {

  setImmediate(() => {
    if(!settings.reporter.console[log.object][log.event]) {
      return;
    }

    console.log(log);
  });

});

module.exports.initConsole = function(options) {
  settings = options;
  return consoleEmitter;
};
