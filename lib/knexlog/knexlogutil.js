'use strict';

class KnexBuilderLog {
  constructor(builder) {

  }
}

//Logging knex query.
class KnexQueryLog {
  constructor(query) {
    this.object = 'knex';
    this.event = 'query';
    this.type = 'info';
    this.timestamp = new Date().getTime();

    this.method = query.method;
    this.sql = query.sql;

    this.options = query.options;
    this.timeout = query.timeout;
    this.cancelOnTimeout = query.cancelOnTimeout;
    this.knexQueryUid = query.__knexQueryUid;

  }
}

//knex query error log
class KnexQueryErrorLog {
  constructor(error) {
    this.object = 'knex';
    this.event = 'queryerror';
    this.type = 'error';
    this.timestamp = new Date().getTime();

    this.message = error.message;
    this.code = error.code;
  }
}

//knex error log
class KnexErrorLog {
  constructor(error) {
    this.object = 'knex';
    this.event = 'error';
    this.type = 'error';
    this.timestamp = new Date().getTime();

    this.message = error.message;
    this.code = error.code;
  }
}

class KnexQueryEndLog {
  constructor() {
    this.object = 'knex';
    this.event = 'end';
    this.type = 'info';
    this.timestamp = new Date().getTime();

    this.message = 'Query executed successfully';
  }
}

module.exports = {
  KnexBuilderLog,
  KnexQueryLog,
  KnexQueryErrorLog,
  KnexErrorLog,
  KnexQueryEndLog
};
