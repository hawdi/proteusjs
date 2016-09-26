'use strict';

const WreckLogUtil = require('./wrecklogutil');
const Generic = require('../genericHttpClientUtil');

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
        /*const strReq = JSON.stringify(req);
        const jsonReq = JSON.parse(strReq);
        console.log(jsonReq);*/
        this.push(() => new Generic.HttpRequest((() => new WreckLogUtil.WreckRequestLog(req))()));

      });

    }

    if(this.settings.wreck.log.response) {

      //wreck response event
      wreck.on('response', (err, req, res, start, uri) => {

        this.push(() => new Generic.HttpResponse((() => new WreckLogUtil.WreckResponseLog(err, req, res, start, uri))()));

      });

    }

  }
}

module.exports = WreckMonitor;
