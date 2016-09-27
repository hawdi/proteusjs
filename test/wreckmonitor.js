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
    reporters: { },
    wreck: {
      enable : true,
      log : {
        request : true,
        response : true
      }
    }
  }
};

const wreckReq = require('./fixtures/wreckrequest');
const wreckRes = require('./fixtures/wreckresponse');
const wreckUri = require('./fixtures/wreckuri');
const wreckFixtures = require('./fixtures/wreck');

describe('Monitor :: Wreck', () => {

  before((done) => {

    new Monitor(wreck, plugin.options);
    plugin.options.reporters.logit = new EventEmitter;
    done();
  });

  it('wreck request handling', (done) => {
    plugin.options.reporters.logit.once('logit', function(result){

      expect(result.object).equal('wreck');
      expect(result.event).equal('request');
      expect(result.protocol).equal(wreckReq.protocol);
      expect(result.href).equal(wreckReq.href);
      done();
    });

    wreck.emit('request', wreckReq);
  });

  it('wreck response handling', (done) => {
    plugin.options.reporters.logit.once('logit', function(result){

      expect(result.object).equal('wreck');
      expect(result.event).equal('response');
      expect(result.statusCode).equal(wreckRes.statusCode);
      expect(result.statusMessage).equal(wreckRes.statusMessage);
      done();
    });

    wreck.emit('response', null, wreckReq, wreckRes, null, wreckUri);
  });

  it('wreck request error', {plan: 4}, (done) => {
    plugin.options.reporters.logit.once('logit', function(result){

      expect(result.object).equal('wreck');
      expect(result.event).equal('response');
      expect(result.statusCode).equal(wreckFixtures.error.output.statusCode);
      expect(result.statusMessage).to.be.equal(wreckFixtures.error.output.payload.message);
      done();
    });

    wreck.emit('response', wreckFixtures.error, wreckReq, null, null, wreckUri);
  });

  it('disable request and response handler', (done) => {

    plugin.options.wreck.log.request = false;
    plugin.options.wreck.log.response = false;

    new Monitor(wreck, plugin.options);
    done();
  });

});
