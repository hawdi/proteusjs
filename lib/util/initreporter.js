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
    if(!options.reporters.console.custom) options.reporters.console && this.initConsole(options);
    else options.reporters.consoleReporter = options.reporters.console.custom;

    log(`${new Date().toISOString()} - ${chalk.cyan('[proteusjs]')} : reporter check completed`);
  }

  initMongo(options) {
    const mongoOpt = options.reporters.mongodb;
    reporters.mongoclient = mongoOpt.module.MongoClient;
    reporters.mongoclient.connect(mongoOpt.url, function (err, db) {
      if (err) {
        options.reporters.mongodb = null;
        log(chalk.red('Proteusjs mongodb connection error'));
      } else {
        log(chalk.green('Proteusjs mongodb connection established'));
      }
    });
  }

  initConsole(options) {
    let creporter = require('./consolereporter');
    options.reporters.consoleReporter = creporter.initConsole(options);
  }

}

module.exports = {
  Reporter
}
