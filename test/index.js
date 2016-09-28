'use strict';

// Load modules

const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');
const Http = require('http');
const Async = require('async');
const Oppsy = require('oppsy'); //to mock oppsy start method.

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
    reporters: { },

    //hapi config
    hapi: {
      includes: {
        request: [],
        response: []
      },
      log: {
        log: true,
        request: true,
        response: true,
        ops: true,
        error: true
      },
      responseEvent: 'tail'
    }

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

  describe('Server :: Hapi start and stop perform', () => {

    it('server starts without error', {plan : 1}, (done) => {

      const server = new Hapi.Server();

      server.register(plugin, (err) => {

        //No err.
        expect(err).to.not.exist();

        server.connection();
        server.start(done);
      });
    });

    it('server stops without error', {plan : 1}, (done) => {

      const server = new Hapi.Server();

      server.register(plugin, (err) => {

        expect(err).to.not.exist();

        server.stop(() => {

          done();
        });
      });
    });

  }); //end of - Server :: Hapi start and stop perform

  describe('Server :: Hapi "log" monitor', () => {

    before((done) => {

      plugin.options.hapi.log = {
        log: true,
        request: false,
        response: false,
        ops: false,
        error: false
      };

      plugin.options.reporters.logit = new EventEmitter;
      done();
    });

    it('perform server log', (done) => {

      plugin.options.reporters.logit.once('logit', function(result){

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

  }); //end of - Server :: Hapi "log" monitor

  describe('Server :: Hapi "request" monitor', () => {

    before((done) => {

      plugin.options.hapi.log = {
        log: false,
        request: true,
        response: false,
        ops: false,
        error: false
      };

      plugin.options.reporters.logit = new EventEmitter;
      done();
    });

    it('server "request" monitor', (done) => {
      plugin.options.reporters.logit = new EventEmitter;
      plugin.options.reporters.logit.once('logit', (result) => {

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
      ]);

    });

  }); //end of - Server :: Hapi "request" monitor

  describe('Server :: Hapi "response" monitor', () => {

    before((done) => {

      plugin.options.hapi.log = {
        log: false,
        request: false,
        response: true,
        ops: false,
        error: false
      };

      plugin.options.reporters.logit = new EventEmitter;
      done();
    });

    it('server "response" monitor', (done) => {
      plugin.options.reporters.logit = new EventEmitter;
      plugin.options.reporters.logit.once('logit', (result) => {

        expect(result.object).to.equal('server');
        expect(result.event).to.equal('response');
        done();
      });

      //start server
      const server = new Hapi.Server();
      server.connection();

      server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {

          reply('Done');
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
      ]);

    });

  }); //end of - Server :: Hapi "response" monitor

  describe('Server :: Hapi "error" monitor', () => {

    before((done) => {

      //log only error event

      plugin.options.hapi.log = {
        log: false,
        request: false,
        response: false,
        ops: false,
        error: true
      };

      plugin.options.reporters.logit = new EventEmitter;
      done();

    });

    it('emit error events to all reporters when they occur', (done) => {

      const server = new Hapi.Server({ debug: false });
      server.connection();

      server.route({
        method: 'GET',
        path: '/',
        config: {
          handler: (request, reply) => {
            reply('done');
            throw new Error('mock error');
          }
        }
      });

      const monitor = internals.monitorFactory(server, {});

      plugin.options.reporters.logit.once('logit', function(result) {

        expect(result.object).equal('server');
        expect(result.event).equal('error');
        expect(result.errorMessage).equal('Uncaught error: mock error');
        done();
      });

      Async.series([
        server.start.bind(server),
        monitor.start.bind(monitor),
        (callback) => {

          const req = Http.request({
            hostname: server.info.host,
            port: server.info.port,
            method: 'GET',
            path: '/?q=test'
          }, (res) => {
            expect(res.statusCode).to.equal(500);
            callback();
          });
          req.end();
        }
      ], monitor.stop(() => {}));

    });

  }); //end of - Server :: Hapi "error" monitor

  describe('Server :: Hapi "ops" monitor', () => {

    before((done) => {

      //log only ops event

      plugin.options.hapi.log = {
        log: false,
        request: false,
        response: false,
        ops: true,
        error: false
      };

      plugin.options.hapi.ops = { interval: 2500 };

      plugin.options.reporters.logit = new EventEmitter;
      done();

    });

    it('"ops" start method get called when the server starts', { plan: 2 }, (done) => {

      const server = new Hapi.Server();
      const start = Oppsy.prototype.start;

      server.register(plugin, (err) => {

        //server starts without error

        expect(err).to.not.exist();

        Oppsy.prototype.start = (interval) => {

          Oppsy.prototype.start = start;

          //oppsy start method should get called.

          expect(interval).to.equal(2500);
        };
        server.connection();
        server.start(done);
      });

    });

    it('"ops" error handling', { plan: 2 }, (done) => {

      const server = new Hapi.Server();
      const monitor = internals.monitorFactory(server, {});

      //mock console error

      const error = console.error;
      console.error = (err) => {
        console.error = error;
        expect(err).to.be.an.instanceof(Error);
        monitor.stop(done);
      };

      monitor.start((err) => {
        expect(err).to.not.exist();
        monitor._ops.emit('error', new Error('mock error'));
      });

    });

    it('verify "ops" data object', { plan: 2 }, (done) => {

      const server = new Hapi.Server();
      server.connection();

      const monitor = internals.monitorFactory(server, {});

      plugin.options.reporters.logit.once('logit', function(result){

        expect(result.object).equal('server');
        expect(result.event).equal('ops');
        done();
      });

      Async.series([
        server.start.bind(server),
        monitor.start.bind(monitor),
        (callback) => {

          monitor.startOps(100);
            return callback();
        },
        (callback) => {

          // time to report
          setTimeout(() => {
            server.stop(callback);
          }, 150);
        }
      ]);
    });

  }); //end of - Server :: Hapi "ops" monitor

});
