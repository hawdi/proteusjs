'use strict';

class WreckRequestLog {
  constructor(request) {
    this.object = 'wreck';
    this.event = 'request';

    this.protocol = request.protocol;
    this.method = request.method;
    this.host = request.host;
    this.href = request.href;
    this.headers = request.headers;
  }

}

class WreckResponseLog {
  constructor(response) {
    this.object = 'wreck';
    this.event = 'response';

    this.statusCode = response.statusCode;
    this.statusMessage = response.statusMessage;
    this.headers = response.headers;
  }

}

module.exports = {
  WreckRequestLog,
  WreckResponseLog
}
