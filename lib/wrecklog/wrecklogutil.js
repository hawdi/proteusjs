'use strict';

class WreckRequestLog {
  constructor(request) {
    this.object = 'wreck';
    this.event = 'request';
    this.type = 'info';
    this.timestamp = new Date().getTime();

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
    this.type = 'info';
    this.timestamp = new Date().getTime();

    this.statusCode = response.statusCode;
    this.statusMessage = response.statusMessage;
    this.headers = response.headers;
  }

}

module.exports = {
  WreckRequestLog,
  WreckResponseLog
}
