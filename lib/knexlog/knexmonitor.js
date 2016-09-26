'use strict';

const KnexLogUtil = require('./knexlogutil');
const Generic = require('../genericDBUtil');

class KnexMonitor {
  constructor(knex, options) {

    if(!knex.client) {
      //log(`${new Date().toISOString()} - ${chalk.red('[proteusjs]')} : knex monitor failed to initialize`);
      //log(`${new Date().toISOString()} - ${chalk.green('[proteusjs]')} : please initialize knex client`);
      return;
    }

    this.settings = options;

    this.captureQueries(knex);

  }

  push (value) {
    this.settings.reporters.logit.emit('logit', value());
  }

  captureQueries(knex) {

    const self = this;

    knex.client.on('start', (builder) => {

      if(self.settings.knex.log.query) {

        //on query execution
        builder.on('query', (query) => {

          self.push(() => new Generic.Query((() => new KnexLogUtil.KnexQueryLog(query))()));
        });
      }

      if(self.settings.knex.log.queryerror) {

        //error after executing query.
        builder.on('query-error', (err) => {

          self.push(() => new Generic.QueryError((() => new KnexLogUtil.KnexQueryErrorLog(err))()));
          //throw err;
        });
      }

      if(self.settings.knex.log.end) {

        // Fire a single "end" event on the builder when
        // all queries have successfully completed.
        builder.on('end', () => {

          self.push(() => new Generic.End((() => new KnexLogUtil.KnexQueryEndLog())()));
        });
      }

      if(self.settings.knex.log.error) {

        // called internally by the pool when a connection times out or the pool is shutdown.
        //or when error occurred while executing a query
        builder.on('error', (err) => {

          self.push(() => new Generic.Error((() => new KnexLogUtil.KnexErrorLog(err))()));
          //throw err;
        });
      }

    });

  }

};

module.exports = KnexMonitor
