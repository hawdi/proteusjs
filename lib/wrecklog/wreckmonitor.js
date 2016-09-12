'use strict';

const WreckLogUtil = require('./wrecklogutil');

class WreckMonitor {
  constructor(wreck, options) {
    const opts = options || {};
    console.log('Initializing Wreck Monitor');
    this.registerEvents(wreck);
  }

  registerEvents(wreck){
    let wreckRequest;
    let wreckResponse;

    // wreck request register
    wreck.on('request', (req) => {
      //stringify req headers
      const strReq = JSON.stringify(req);
      const jsonReq = JSON.parse(strReq);

      wreckRequest = new WreckLogUtil.WreckRequestLog(jsonReq);

      //console.log(wreckRequest.getJSON());
    });

    //wreck response event
    wreck.on('response', (err, req, res, start, uri) => {

      let cache = [];

      const strRes = JSON.stringify(res, function(key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
          }
          // Store value in our collection
          cache.push(value);
        }
        return value;
      });

      cache = null; // Enable garbage collection
      const jsonRes = JSON.parse(strRes);

      wreckResponse = new WreckLogUtil.WreckResponseLog(jsonRes);

      console.log(wreckResponse.getJSON());

      /*
      wreck.read(res, null, (err, body) => {
        // catch error
        console.log("read");
        if(err){
          console.log(err);
        }else {
          console.log(body.toString());
        }
      });
      */

    });
  }
}

module.exports = WreckMonitor;
