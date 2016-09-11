'use strict';

// Load Modules

const Joi = require('joi');

exports.proteusjs = Joi.object().keys({
  includes: Joi.object().keys({
    request: Joi.array().items(Joi.string().valid('headers', 'payload')).default([]),
    response: Joi.array().items(Joi.string().valid('payload')).default([])
  }).default({
    request: [],
    response: []
  }),
  mongodb: Joi.object().keys({
    url: Joi.string().default(null)
  }).default({
    url: null
  }),
  ops: Joi.alternatives([Joi.object(), Joi.bool().allow(false)]).default({
    config: {},
    interval: 15000
  }),
  responseEvent: Joi.string().valid('response', 'tail').default('tail'),
  knex: Joi.func()
}).unknown(false);
