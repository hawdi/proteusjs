'use strict';

const Pumpify = require('pumpify');
const events = require('events');
const emitter = new events.EventEmitter();

const settings = {};

emitter.on('logit', (log) => {

  setImmediate(() => {
    //console.log(log);
    if(settings.streams) {
      settings.streams.write(log);
    }

  });

});

module.exports.init = function(options) {

  const streamObjs = [];

  //set settings
  if(options.reporters.console) {
    const CONR = options.reporters.console;
    const conR = new CONR();
    conR.pipe(process.stdout);
    //streamObjs.push(conR);
    //settings.console = conR;
    settings.streams = conR;
  }

  //streamObjs.unshift(process.stdout);

  //settings.streams = Pumpify.obj(streamObjs);

  if(!options.reporters.logit) {
    return options.reporters.logit = emitter;
  }

  //check console stream
};
