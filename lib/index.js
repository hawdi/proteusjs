'use strict';

const Joi = require('joi');
const Hoek = require('hoek');

const Schema = require('./schema');
const ServerMonitor = require('./serverlog/servermonitor');
const KnexMonitor = require('./knexlog/knexmonitor');
const WreckMonitor = require('./wrecklog/wreckmonitor');

const internals = {
  initializePackages(options) {

    console.log('proteusjs is checking required packages');

    options.knex && (new KnexMonitor(options.knex, null));

    options.wreck && (new WreckMonitor(options.wreck, null));

    console.log('proteusjs done with package checking');
  },

  onPostStop(servermonitor) {
    return (server, next) => {
      //servermonitor.stop(next);
      return next();
    };
  },

  onPreStart(servermonitor, options) {
    return (server, next) => {
      const interval = options.ops.interval;
      servermonitor.startOps(interval);
      return next();
    };
  }
};

exports.register = function (server, options, next) {

  const result = Joi.validate(options, Schema.proteusjs);
  Hoek.assert(!result.error, 'Invalid options of proteusjs', result.error);

  internals.initializePackages(result.value);

  const servermonitor = new ServerMonitor(server, result.value);

  server.ext([{
    type: 'onPostStop',
    method: internals.onPostStop(servermonitor)
  }, {
    type: 'onPreStart',
    method: internals.onPreStart(servermonitor, result.value)
  }]);

  return servermonitor.start(next);
};

exports.register.attributes = {
  pkg: require('../package.json')
};
