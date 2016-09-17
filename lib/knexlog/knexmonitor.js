'use strict';

const chalk = require('chalk');
chalk.enabled = true;

const KnexLogUtil = require('./knexlogutil');

class KnexMonitor {
  constructor(knex, options) {

    //No console message during test.
    let log;
    if (process.env.NODE_ENV !== 'test') log = console.log;
    else log = function(data) { return; }

    log(`${new Date().toISOString()} - ${chalk.cyan('[proteusjs]')} : initializing knex monitor`);

    if(!knex.client) {
      log(`${new Date().toISOString()} - ${chalk.red('[proteusjs]')} : knex monitor failed to initialize`);
      log(`${new Date().toISOString()} - ${chalk.green('[proteusjs]')} : please initialize knex client`);
      return;
    }

    this.settings = options;

    this.captureQueries(knex);

    log(`${new Date().toISOString()} - ${chalk.cyan('[proteusjs]')} : knex monitor initialization completed`);
  }

  push (value) {

    let  result = value();
    result = JSON.stringify(result);
    result = JSON.parse(result);

    this.settings.reporter.console.knex && this.settings.reporter.consoleReporter.emit('consolelog', result);

  };

  captureQueries(knex) {

    const self = this;

    knex.client.on('start', (builder) => {
      //on query execution
      builder.on('query', (query) => {

        self.push(() => new KnexLogUtil.KnexQueryLog(query));
      });

      //error after executing query.
      builder.on('query-error', (err) => {

        self.push(() => new KnexLogUtil.KnexQueryErrorLog(err));
        //throw err;
      });

      // Fire a single "end" event on the builder when
      // all queries have successfully completed.
      builder.on('end', () => {

        self.push(() => new KnexLogUtil.KnexQueryEndLog());
      });

      // called internally by the pool when a connection times out or the pool is shutdown.
      //or when error occurred while executing a query
      builder.on('error', (err) => {

        self.push(() => new KnexLogUtil.KnexErrorLog(err));
        //throw err;
      });

    });

  }

};

module.exports = KnexMonitor
