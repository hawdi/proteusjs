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

    this.method = query.method;
    this.options = query.options;
    this.timeout = query.timeout;
    this.cancelOnTimeout = query.cancelOnTimeout;
    this.knexQueryUid = query.__knexQueryUid;
    this.sql = query.sql;
  }
}

//knex error log
class KnexErrorLog {
  constructor(error) {
    this.object = 'knex';
    this.event = 'error';

    this.code = error.code;
    this.errno = error.errno;
    this.sqlState = error.sqlState;
    this.index = error.index;
    this.error = error.message;
  }
}

module.exports = {
  KnexBuilderLog,
  KnexQueryLog,
  KnexErrorLog
};
