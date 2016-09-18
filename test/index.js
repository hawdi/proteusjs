'use strict';

// Load modules

const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

// Test shortcuts
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

const Proteusjs = require('../lib');

const plugin = {
  register: Proteusjs.register,
  options: {
    includes : {
      request: [],
      response: []
    },
    reporter: {
      console: {
        server: {
          request : true
        },
        wreck : {
          request: true,
          response : true
        },
        knex : {
          query : true,
          error : true,
          end : true,
          queryerror : false,
        }
      }
    },
    ops: {
      config: {},
      interval: 60000
    }
  }
};

describe('Proteusjs :: Main', () => {

  it('start without error', (done) => {

    const server = new Hapi.Server();

    server.register(plugin, (err) => {

      //No err.
      expect(err).to.not.exist();

      server.connection();
      server.start(done);
    });
  });

  it('stop without error', (done) => {

    const server = new Hapi.Server();

    server.register(plugin, (err) => {

      expect(err).to.not.exist();

      server.stop(() => {

        done();
      });
    });
  });

});
