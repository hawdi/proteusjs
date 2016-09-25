# proteusjs

proteusjs has a ability to monitor various events emitted from [hapi](https://github.com/hapijs/hapi), [wreck](https://github.com/tgriesser/knex), [knex](https://github.com/hapijs/wreck) as well as [ops](https://github.com/hapijs/oppsy) information from the host machine. It listens for events emitted by different source and pushes standardized events to a collection of streams. It's primary focus is to monitor `server`, `database` and `remote` call events in an application.

Lead Maintainer: [Jai Kishan](https://github.com/geekjai)

##Example Usage
> **proteusjs.config.js**

```javascript
'use strict';

const proteus = require('proteusjs');
const proteusConsole = require('proteusjs-console');
const database = require('./database.js');

module.exports = {
  register: proteus,
  options: {
    reporters : {
      console : proteusConsole
    },
    //hapi setup
    hapi: {
      log: {
        log: true,
        request: true,
        response: true,
        ops: true
      }
    },
    //knex config
    'knex': {
      lib: database,
      enable: true,
      log: {
        query: true,
        error: true,
        end: true,
        queryerror: true
      }
    },
    //wreck config
    'wreck': {
      lib: require('wreck'),
      enable: true,
      log: {
        request: true,
        response : true
      }
    }
  }
}

```

##Existing streams
Any transform or write stream can work with proteusjs. The following streams work with proteusjs.
- [proteusjs-console](https://github.com/hawdi/proteusjs-console)
