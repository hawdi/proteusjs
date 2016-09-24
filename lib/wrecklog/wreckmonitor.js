'use strict';

const WreckLogUtil = require('./wrecklogutil');
const Generic = require('../httpclientutil');

class WreckMonitor {
  constructor(wreck, options) {

    this.settings = options;
    this.registerEvents(wreck);

  }

  push (value) {
    this.settings.reporters.logit.emit('logit', value());
  };

  registerEvents(wreck) {

    if(this.settings.wreck.log.request) {

      // wreck request register
      wreck.on('request', (req) => {
        //stringify req headers
        const strReq = JSON.stringify(req);
        const jsonReq = JSON.parse(strReq);

        this.push(() => new Generic.HttpRequest((() => new WreckLogUtil.WreckRequestLog(jsonReq))()));

      });

    }

    if(this.settings.wreck.log.response) {

      //wreck response event
      wreck.on('response', (err, req, res, start, uri) => {

        const response = {
          method : req.method,
          statusCode: '',
          statusMessage: '',
          header: {},
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
          response.header = res.headers;
        }

        this.push(() => new Generic.HttpResponse((() => new WreckLogUtil.WreckResponseLog(response))()));

      });

    }

  }
}

module.exports = WreckMonitor;
