'use strict';

class KnexBuilderLog {
  constructor(builder) {

  }
}

//Logging knex query.
class KnexQueryLog {
  constructor(query) {
    this.method = query.method;
    this.options = query.options;
    this.timeout = query.timeout;
    this.cancelOnTimeout = query.cancelOnTimeout;
    this.knexQueryUid = query.__knexQueryUid;
    this.sql = query.sql;
  }

  getJSON() {
    return {
      KnexQueryLog : {
        method : this.method,
        options : this.options,
        timeout : this.timeout,
        cancelOnTimeout : this.cancelOnTimeout,
        knexQueryUid : this.knexQueryUid,
        sql : this.sql
      }
    }
  }
}

//knex error log
class KnexErrorLog {
  constructor(error) {
    this.code = error.code;
    this.errno = error.errno;
    this.sqlState = error.sqlState;
    this.index = error.index;
    this.error = error.message;
  }

  getJSON() {
    return {
      KnexErrorLog : {
        code : this.code,
        errno : this.errno,
        sqlState : this.sqlState,
        index : this.index,
        error : this.error
      }
    }
  }
}

module.exports = {
  KnexBuilderLog,
  KnexQueryLog,
  KnexErrorLog
};
