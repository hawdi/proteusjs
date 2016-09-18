'use strict';

// Load modules

const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');
const Http = require('http');
const Async = require('async');

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
    includes: {
      request: [],
      response: []
    },
    reporter: {
      console: {
        server: {
          log : true,
          request : true,
          response : true
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
    },
    responseEvent: 'tail'
  }
};

const Monitor = require('../lib/serverlog/servermonitor');
// Declare internals
const internals = {
  monitorFactory(server, options) {

    const defaults = plugin.options

    if (server.hasListeners === undefined) {
      const hasListeners = function (event) {

        return this.listeners(event).length > 0;
      };

      server.decorate('server', 'hasListeners', hasListeners);
    }

    if (server.event !== undefined) {
      server.event('internalError');
      server.event('super-secret');
    }

    return new Monitor(server, Object.assign({}, defaults, options));
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

  it('server "request" monitor', (done) => {
    plugin.options.reporter.consoleReporter = new EventEmitter;
    plugin.options.reporter.consoleReporter.once('consolelog', (result) => {

      expect(result.object).to.equal('server');
      expect(result.event).to.equal('request');
      expect(result.method).to.equal('get');
      expect(result.path).to.equal('/');
      expect(result.tags.length).to.equal(2);
      done();
    });

    //start server
    const server = new Hapi.Server();
    server.connection();

    server.route({
      method: 'GET',
      path: '/',
      handler: (request, reply) => {

        request.log(['proteusjs', 'test'], '/ route');
        reply();
      }
    });

    const monitor = internals.monitorFactory(server, {});

    Async.series([
      server.start.bind(server),
      monitor.start.bind(monitor),
      (callback) => {
        server.inject(
          {
            url: '/'
          }, (res) => {
            expect(res.statusCode).to.equal(200);
          }
        )
      }
    ], done);

  });

});
