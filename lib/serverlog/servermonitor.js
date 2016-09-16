'use strict';

const OS = require('os');
const Hoek = require('hoek');
const Oppsy = require('oppsy');

const LogUtil = require('./serverlogutil');
const Package = require('../../package.json');

// Declare internals

const internals = {
  host: OS.hostname(),
  appVer: Package.version
};

class ServerMonitor {
  constructor(server, options) {
    this.settings = options;
    this._state = {
      handlers: {}
    };
    this._server = server;

    //An EventEmitter useful for collecting hapi server ops information.

    this._ops = this.settings.ops && new Oppsy(server, this.settings.ops.config);

    // Event handlers

    this._logHandler = (event) => {
      this.push(() => new LogUtil.ServerLog(event));
    };

    this._requestLogHandler = (request, event) => {
      this.push(() => new LogUtil.RequestLog(request, event));
    };

    this._opsHandler = (results) => {
      this.push(() => new LogUtil.Ops(results));
    };

    //Object creation for resonse handlers

    const reducer = (obj, value) => {
      obj[value] = true;
      return obj;
    };

    const reqOptions = this.settings.includes.request.reduce(reducer, {});
    const resOptions = this.settings.includes.response.reduce(reducer, {});

    this._responseHandler = (request) => {
      this.push(() => new LogUtil.RequestSent(reqOptions, resOptions, request));
    };
  }

  push(value) {

    let  result = value();
    result = JSON.stringify(result);
    result = JSON.parse(result);

    this.settings.reporter.console && this.settings.reporter.consoleReporter.emit('consolelog', result);

  }

  startOps(interval) {
    this._ops && this._ops.start(interval); //oppsy.start(1000);
  }

  start(callback) {

    this.outputSetup();

    //key name to extend handlers objects

    this._state.handlers.log = this._logHandler;
    this._state.handlers.request = this._requestLogHandler;
    this._state.handlers[this.settings.responseEvent] = this._responseHandler;

    // Initializing Events

    internals.forOwn(this._state.handlers, (event, handler) => {
      this._server.on(event, handler);
    });

    //Initialize ops event.

    if (this._ops) {
      this._ops.on('ops', this._opsHandler);
      this._ops.on('error', (err) => {
        console.error(err);
      });
    }

    return callback();
  }

  stop(callback) {

    const state = this._state;

    if (this._ops) {
      this._ops.stop();
      this._ops.removeAllListeners();
    }

    internals.forOwn(state.handlers, (event, handler) => {

      this._server.removeListener(event, handler);
    });

    setImmediate(callback);
  }

  outputSetup() {

  }
}

module.exports = ServerMonitor;

internals.forOwn = (obj, func) => {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    func(key, obj[key]);
  }
};
