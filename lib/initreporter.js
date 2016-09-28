'use strict';

const Stream = require('stream');
const events = require('events');
const emitter = new events.EventEmitter();

const settings = {};

class NoStream extends Stream.Transform {
  constructor() {

    super({ objectMode: true });
  }
  _transform(value, encoding, next) {

    next(null, value);
  }
}

emitter.on('logit', (log) => {

  setImmediate(() => {
    //console.log(log);
    if(settings.streams) {
      settings.streams.write(log);
    }

  });

});

module.exports.init = function(options) {

  //check if user has attached their own receiver for this emitter

  if(options.reporters.logit) {
    return;
  }

  options.reporters.logit = emitter;

  //currenly support for console

  if(options.reporters.console) {

    const CONR = options.reporters.console;

    // Check reporter is initialized or not.

    if (typeof CONR.pipe === 'function') {
      CONR.pipe(process.stdout); //only need to attach console out.
      return settings.streams = CONR;
    }

    const conR = new CONR();
    conR.pipe(process.stdout);
    return settings.streams = conR;
  }

  const noStream = new NoStream();
  return settings.streams = noStream;

};
