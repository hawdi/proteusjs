'use strict';

const chalk = require('chalk');
chalk.enabled = true;

const reporter = { };
let log;

class Reporter {
  constructor (options) {

    //No console message during test.
    let log;
    if (process.env.NODE_ENV !== 'test') log = console.log;
    else log = function(data) { return; }

    log(`${new Date().toISOString()} - ${chalk.cyan('[proteusjs]')} : checking reporter`);

    //check mongodb is initilized.
    //options.reporter.mongodb && this.initMongo(options); //disabling for this release, will available in next.
    options.reporter.console && this.initConsole(options);

    log(`${new Date().toISOString()} - ${chalk.cyan('[proteusjs]')} : reporter check completed`);
  }

  initMongo(options) {
    const mongoOpt = options.reporter.mongodb;
    reporter.mongoclient = mongoOpt.module.MongoClient;
    reporter.mongoclient.connect(mongoOpt.url, function (err, db) {
      if (err) {
        options.reporter.mongodb = null;
        log(chalk.red('Proteusjs mongodb connection error'));
      } else {
        log(chalk.green('Proteusjs mongodb connection established'));
      }
    });
  }

  initConsole(options) {
    let creporter = require('./consolereporter');
    options.reporter.consoleReporter = creporter.initConsole(options);
  }

  getReporter() {
    return reporter;
  }
}

module.exports = {
  Reporter
}
