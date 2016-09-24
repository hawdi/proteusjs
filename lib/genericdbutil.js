'use strict';

class Query {
  constructor(query) {
    this.object = query.object;
    this.event = query.event;
    this.type = 'database';

    this.timestamp = query.timestamp;

    this.method = query.method;
    this.sql = query.sql;

    this.options = query.options;
    this.timeout = query.timeout;

  }
}

class QueryError {
  constructor(error) {
    this.object = error.object;
    this.event = error.event;
    this.type = 'database';

    this.timestamp = error.timestamp;

    this.message = error.message;
  }
}

class Error {
  constructor(error) {
    this.object = error.object;
    this.event = error.event;
    this.type = 'database';

    this.timestamp = error.timestamp;

    this.message = error.message;
  }
}

class End {
  constructor(end) {
    this.object = end.object;
    this.event = end.event;
    this.type = 'database';

    this.timestamp = end.timestamp;

    this.message = end.message;
  }
}

module.exports = {
  Query,
  QueryError,
  Error,
  End
};
