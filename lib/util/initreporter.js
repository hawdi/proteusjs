'use strict';

const chalk = require('chalk');
const log = console.log;
chalk.enabled = true;

const reporter = { };

class Reporter {
  constructor (options) {
    log(chalk.cyan('Checking reporter...'));
    //check mongodb is initilized.
    options.reporter.mongodb && this.initMongo(options);
    
    log(chalk.cyan('Reporter check done.'));
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

  getReporter() {
    return reporter;
  }
}

module.exports = {
  Reporter
}
