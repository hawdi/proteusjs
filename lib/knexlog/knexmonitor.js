'use strict';

const KnexLogUtil = require('./knexlogutil');

class KnexMonitor {
  constructor(knex, options) {
    const opts = options || {};

    knex.client.on('start', this.captureQueries);

  }

  captureQueries(builder) {
    // measuring performance between intervals.
    const StartTime = process.hrtime();
    //console.log(builder);

    //on query execution
    builder.on('query', function(query){
      /*
      const lquery = new KnexLogUtil.KnexQueryLog(query);
      console.log(lquery.getJSON());*/
    });

    //on error
    builder.on('query-error', function(err){
      /*const lerr = new KnexLogUtil.KnexErrorLog(err);
      console.log(lerr.getJSON());*/
      throw err;
    });

    //query ends (on success)
    builder.on('end', function(){

    });
  }

};

module.exports = KnexMonitor
