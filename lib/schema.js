'use strict';

const Joi = require('joi');

exports.proteusjs = Joi.object().keys({
  includes: Joi.object().keys({
    request: Joi.array().items(Joi.string().valid('headers', 'payload')).default([]),
    response: Joi.array().items(Joi.string().valid('payload')).default([])
  }).default({
    request: [],
    response: []
  }),
  reporter: Joi.object().keys({
    mongodb: Joi.object().keys({
      module : Joi.func(),
      url: Joi.string()
    }).default({
      module: null,
      url: null
    }),
    console: Joi.bool().default(true),
  }).default({
    mongodb: null
  }),
  ops: Joi.alternatives([Joi.object(), Joi.bool().allow(false)]).default({
    config: {},
    interval: 60000
  }),
  responseEvent: Joi.string().valid('response', 'tail').default('tail'),
  knex: Joi.func(),
  wreck: Joi.object()
}).unknown(false);
