'use strict';

class HttpRequest {
  constructor(request) {
    this.object = request.object;
    this.event = request.event;
    this.type = 'httpclient';

    this.timestamp = request.timestamp;

    this.protocol = request.protocol;
    this.method = request.method;
    this.host = request.host;
    this.href = request.href;
    this.headers = request.headers;
  }

}

class HttpResponse {
  constructor(response) {
    this.object = response.object;
    this.event = response.event;
    this.type = 'httpclient';

    this.timestamp = response.timestamp;

    this.method = response.method;
    this.host = response.host;
    this.href = response.href;
    this.statusCode = response.statusCode;
    this.statusMessage = response.statusMessage;
    this.headers = response.headers;
  }

}

module.exports = {
  HttpRequest,
  HttpResponse
}
