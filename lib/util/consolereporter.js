'use strict';

const events = require('events');

const consoleEmitter = new events.EventEmitter();
let settings = {};

consoleEmitter.on('consolelog', (log) => {

  setImmediate(() => {
    if(!settings.reporters.console[log.object][log.event]) {
      return;
    }

    if(log.object === 'wreck'){
      wrecklog(log);
      return;
    } else if (log.object === 'server') {
      serverlog(log);
      return;
    }

  });

});

function serverlog(log) {
  console.log(log);
}

function wrecklog(log) {
  if(log.event === 'request'){
    console.log(`${new Date(log.timestamp).toISOString()}`);
  }
  console.log(log);
}

module.exports.initConsole = function(options) {
  settings = options;
  return consoleEmitter;
};
