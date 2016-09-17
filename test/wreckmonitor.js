'use strict';

// Load modules

const Code = require('code');
const Lab = require('lab');

// Test shortcuts
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;
const before = lab.before;

//creating knex EventEmitter
const EventEmitter = require('events').EventEmitter;
const builder = new EventEmitter;
const wreck = new EventEmitter;

const Monitor = require('../lib/wrecklog/wreckmonitor');

const plugin = {
  options: {
    reporter: {
      console: {
        wreck : {
          request : true,
          response : true
        }
      }
    }
  }
};

const wreckReq = require('./fixtures/wreckrequest');
const wreckRes = require('./fixtures/wreckresponse');

describe('Monitor :: Wreck', () => {

  before((done) => {

    new Monitor(wreck, plugin.options);
    plugin.options.reporter.consoleReporter = new EventEmitter;
    done();
  });

  it('wreck request handling', (done) => {
    plugin.options.reporter.consoleReporter.once('consolelog', function(result){

      expect(result.object).equal('wreck');
      expect(result.event).equal('request');
      expect(result.protocol).equal(wreckReq.protocol);
      expect(result.href).equal(wreckReq.href);
      done();
    });

    wreck.emit('request', wreckReq);
  });

  it('wreck response handling', (done) => {
    plugin.options.reporter.consoleReporter.once('consolelog', function(result){

      expect(result.object).equal('wreck');
      expect(result.event).equal('response');
      expect(result.statusCode).equal(wreckRes.statusCode);
      expect(result.statusMessage).equal(wreckRes.statusMessage);
      done();
    });

    wreck.emit('response', null, null, wreckRes, null, null);
  });

  it('wreck console reporter is null', (done) => {

    plugin.options.reporter.console.wreck = null;
    wreck.emit('request', wreckReq);
    expect('').equal('');
    done();
  });

});
