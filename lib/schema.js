'use strict';

const Joi = require('joi');

exports.proteusjs = Joi.object().keys({

  //reporter setup

  reporters: Joi.object().keys({
    logit: Joi.object().default(null),
    console: Joi.alternatives([Joi.object().default(null), Joi.func()])
  }),

  //hapi

  hapi: Joi.object().keys({
    includes: Joi.object().keys({
      request: Joi.array().items(Joi.string().valid('headers', 'payload')).default([]),
      response: Joi.array().items(Joi.string().valid('payload')).default([])
    }).default({
      request: [],
      response: []
    }),
    log: Joi.object().keys({
      log: Joi.bool().default(false),
      request: Joi.bool().default(false),
      response: Joi.bool().default(false),
      ops: Joi.bool().default(false),
      error: Joi.bool().default(false)
    }).default({
      log: false,
      request: false,
      response: false,
      ops: false,
      error: false
    }),
    responseEvent: Joi.string().valid('response', 'tail').default('tail'),
    //ops setup
    ops: Joi.alternatives([Joi.object(), Joi.bool().allow(false)]).default({
      config: {},
      interval: 30000
    })
  }).default({
    includes: {
      request: [],
      response: []
    },
    log: {
      log: false,
      request: false,
      response: false,
      ops: false
    },
    responseEvent: 'tail',
    ops: {
      config: {},
      interval: 60000
    }
  }),

  //knex config

  knex: Joi.object().keys({
    lib: Joi.func().default(null),
    enable: Joi.bool().default(false),
    log: Joi.object().keys({
      query: Joi.bool().default(false),
      error: Joi.bool().default(false),
      end: Joi.bool().default(false),
      queryerror: Joi.bool().default(false)
    }).default({
      query: false,
      error: false,
      end: false,
      queryerror: false
    })
  }).default({
    enable: false,
    log: {
      query: false,
      error: false,
      end: false,
      queryerror: false
    }
  }),

  //wreck config

  wreck: Joi.object().keys({
    lib: Joi.object().default(null),
    enable: Joi.bool().default(false),
    log: Joi.object().keys({
      request: Joi.bool().default(false),
      response: Joi.bool().default(false)
    }).default({
      request: false,
      response: false
    })
  }).default({
    enable: false,
    log: {
      request: false,
      response: false
    }
  })

}).unknown(false);
