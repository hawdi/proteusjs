'use strict';

const OS = require('os');
const Hoek = require('hoek');
const Oppsy = require('oppsy');

const LogUtil = require('./hapilogutil');
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

    if(this.settings.hapi.log.ops) {

      this._ops = this.settings.hapi.ops && new Oppsy(server, this.settings.hapi.ops.config);
    }

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

    const reqOptions = this.settings.hapi.includes.request.reduce(reducer, {});
    const resOptions = this.settings.hapi.includes.response.reduce(reducer, {});

    this._responseHandler = (request) => {
      this.push(() => new LogUtil.RequestSent(reqOptions, resOptions, request));
    };

    //error handlers
    this._errorHandler = (request, error) => {

      this.push(() => new LogUtil.RequestError(request, error));
    };
  }

  push(value) {
    this.settings.reporters.logit.emit('logit', value());
  }

  startOps(interval) {
    this._ops && this._ops.start(interval); //oppsy.start(1000);
  }

  start(callback) {

    //key name to extend handlers objects

    this.settings.hapi.log.log && (this._state.handlers.log = this._logHandler);

    this.settings.hapi.log.request && (this._state.handlers.request = this._requestLogHandler);

    this.settings.hapi.log.response && (this._state.handlers[this.settings.hapi.responseEvent] = this._responseHandler);

    this.settings.hapi.log.error && (this._state.handlers['request-error'] = this._errorHandler);

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

}

module.exports = ServerMonitor;

internals.forOwn = (obj, func) => {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    func(key, obj[key]);
  }
};
