'use strict';

const reporter = { };

class Reporter {
  constructor (options) {
    //check mongodb is initilized.
    options.reporter.mongodb && this.initMongo(options);

  }

  initMongo(options) {
    const mongoOpt = options.reporter.mongodb;
    reporter.mongoclient = mongoOpt.module.MongoClient;
    reporter.mongoclient.connect(mongoOpt.url, function (err, db) {
      if (err) {
        options.reporter.mongodb = null;
        console.log(err);
      } else {
        console.log('connection stablished');
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
