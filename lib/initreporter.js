'use strict';

const events = require('events');
const emitter = new events.EventEmitter();

var settings = {};

emitter.on('logit', (log) => {

  setImmediate(() => {
    console.log(log);
  });

});

module.exports.init = function(options) {

  //set settings
  settings = options;

  if(!options.reporters.logit) {
    return options.reporters.logit = emitter;
  }

};
