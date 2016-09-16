'use strict';

const events = require('events');

let consoleEmitter = new events.EventEmitter();

consoleEmitter.on('consolelog', (jsonData) => {
  setImmediate(() => {

    console.log(jsonData);

  });
});

module.exports = consoleEmitter;
