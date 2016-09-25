'use strict';

class WreckRequestLog {
  constructor(request) {
    this.object = 'wreck';
    this.event = 'request';

    this.timestamp = new Date().getTime();

    this.protocol = request.protocol;
    this.method = request.method;
    this.host = request.host;
    this.href = request.href;
    this.headers = request.headers;
  }

}

class WreckResponseLog {
  constructor(err, req, res, start, uri) {

    const response = {
      method : req.method,
      statusCode: '',
      statusMessage: '',
      headers: {},
      host: uri.host,
      path: uri.path,
      href: uri.href,
    }

    if(err) {
      response.statusCode = err.output.statusCode;
      response.statusMessage = err.output.payload.message;
    } else {
      response.statusCode = res.statusCode;
      response.statusMessage = res.statusMessage;
      response.headers = res.headers;
    }

    this.object = 'wreck';
    this.event = 'response';

    this.timestamp = new Date().getTime();

    this.method = response.method;
    this.host = response.host;
    this.href = response.href;
    this.statusCode = response.statusCode;
    this.statusMessage = response.statusMessage;
    this.headers = response.headers;
  }

}

module.exports = {
  WreckRequestLog,
  WreckResponseLog
}
