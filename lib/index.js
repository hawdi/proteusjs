'use strict';

const Joi = require('joi');
const Hoek = require('hoek');
const chalk = require('chalk');
chalk.enabled = true;

const Schema = require('./schema');
const ServerMonitor = require('./serverlog/servermonitor');
const KnexMonitor = require('./knexlog/knexmonitor');
const WreckMonitor = require('./wrecklog/wreckmonitor');
const Reporter = require('./util/initreporter');

const internals = {
  initializePackages(options) {

    //No console message during test.
    let log;
    if (process.env.NODE_ENV !== 'test') log = console.log;
    else log = function(data) { return; }

    log(`${new Date().toISOString()} - ${chalk.cyan('[proteusjs]')} : checking required packages`);

    if(options.knex.enable) {

      options.knex.lib && (new KnexMonitor(options.knex.lib, options));
    }

    if(options.wreck.enable) {

      options.wreck.lib && new WreckMonitor(options.wreck.lib, options);
    }

    log(`${new Date().toISOString()} - ${chalk.cyan('[proteusjs]')} : package checking completed`);
  },

  onPostStop(servermonitor) {
    return (server, next) => {
      servermonitor.stop(next);
    };
  },

  onPreStart(servermonitor, options) {
    return (server, next) => {
      const interval = options.ops.interval;
      servermonitor.startOps(interval);
      return next();
    };
  },

  onPostStart(options) {
    return (server, next) => {

      //Initializing reporter after server start

      new Reporter(options);

      next();
    };
  }
};

exports.register = function (server, options, next) {

  const result = Joi.validate(options, Schema.proteusjs);
  Hoek.assert(!result.error, 'Invalid options of proteusjs', result.error);

  internals.initializePackages(result.value);

  const servermonitor = new ServerMonitor(server, result.value);

  //https://github.com/hapijs/discuss/issues/327 : onPostStop

  server.ext([{
    type: 'onPostStop',
    method: internals.onPostStop(servermonitor)
  }, {
    type: 'onPreStart',
    method: internals.onPreStart(servermonitor, result.value)
  }, {
    type: 'onPostStart',
    method: internals.onPostStart(result.value)
  }]);

  return servermonitor.start(next);
};

exports.register.attributes = {
  pkg: require('../package.json')
};
