'use strict';

const chalk = require('chalk');
const log = console.log;
chalk.enabled = true;

const KnexLogUtil = require('./knexlogutil');

class KnexMonitor {
  constructor(knex, options) {

    log(`${new Date().toISOString()} - ${chalk.cyan('[proteusjs]')} : initializing knex monitor`);

    this.settings = options;

    const opts = options || {};
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
      builder.on('query', function(query) {

        self.push(() => new KnexLogUtil.KnexQueryLog(query));
      });

      //on error
      builder.on('query-error', function(err) {

        self.push(() => new KnexLogUtil.KnexErrorLog(err));
        throw err;
      });

      //query ends (on success)
      builder.on('end', function(){

      });

    });

  }

};

module.exports = KnexMonitor
