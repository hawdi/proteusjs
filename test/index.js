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
const before = lab.before;

const Proteusjs = require('../lib');

//creating knex EventEmitter
const EventEmitter = require('events').EventEmitter;

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

  before((done) => {

    plugin.options.reporter.console.custom = new EventEmitter;
    done();
  });

  it('server starts without error', (done) => {

    const server = new Hapi.Server();

    server.register(plugin, (err) => {

      //No err.
      expect(err).to.not.exist();

      server.connection();
      server.start(done);
    });
  });

  it('server stops without error', (done) => {

    const server = new Hapi.Server();

    server.register(plugin, (err) => {

      expect(err).to.not.exist();

      server.stop(() => {

        done();
      });
    });
  });

  it('perform server log', (done) => {

    plugin.options.reporter.console.custom.once('consolelog', function(result){

      expect(result.object).equal('server');
      expect(result.event).equal('log');
      expect(result.tags[0]).equal('proteusjs');
      expect(result.data).equal('test');
      done();
    });

    const server = new Hapi.Server();

    server.register(plugin, (err) => {

      expect(err).to.not.exist();
      server.connection();

      server.route({
        method : 'GET',
        path : '/',
        handler : function (request, reply) {
          server.log(['proteusjs'], 'test');
          reply('echo');
        }
      });

      server.start(() => {
        server.inject('/', (res) => { });
      });

    });

  });

});
