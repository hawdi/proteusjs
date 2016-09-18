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
    //console reporting schema setup
    console: Joi.object().keys({

      //custom reporter for console, like on desire any other reporting for console can be injected.
      custom : Joi.object().default(null),

      //hapijs server

      server : Joi.object().keys({
        log : Joi.bool().default(false),
        request : Joi.bool().default(false),
        response : Joi.bool().default(false),
        ops : Joi.bool().default(false)
      }),

      //wreck

      wreck : Joi.object().keys({
        request : Joi.bool().default(false),
        response : Joi.bool().default(false)
      }),

      //knex

      knex : Joi.object().keys({
        error : Joi.bool().default(false),
        query : Joi.bool().default(false),
        end : Joi.bool().default(false),
        queryerror : Joi.bool().default(false)
      })
    }).default({
      server : null,
      wreck : null,
      knex : null
    })
  }),
  ops: Joi.alternatives([Joi.object(), Joi.bool().allow(false)]).default({
    config: {},
    interval: 60000
  }),
  responseEvent: Joi.string().valid('response', 'tail').default('tail'),
  knex: Joi.func(),
  wreck: Joi.object()
}).unknown(false);
