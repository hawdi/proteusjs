'use strict';

class WreckRequestLog {
  constructor(request) {
    this.protocol = request.protocol;
    this.method = request.method;
    this.host = request.host;
    this.href = request.href;
    this.headers = request.headers;
  }

  getJSON(){
    return {
      WreckRequestLog : {
        protocol : this.protocol,
        method : this.method,
        host : this.host,
        href : this.href,
        headers : this.headers
      }
    }
  }
}

class WreckResponseLog {
  constructor(response) {
    this.statusCode = response.statusCode;
    this.statusMessage = response.statusMessage;
    this.headers = response.headers;
  }

  getJSON(){
    return {
      WreckResponseLog : {
        statusCode : this.statusCode,
        statusMessage : this.statusMessage,
        headers : this.headers
      }
    }
  }

}

module.exports = {
  WreckRequestLog,
  WreckResponseLog
}
