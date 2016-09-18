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
const knex = {};
knex.client = new EventEmitter;

const Monitor = require('../lib/knexlog/knexmonitor');

const plugin = {
  options: {
    reporters: {
      console: {
        knex : {
          query : true,
          error : true,
          end : true,
          queryerror : true,
        }
      }
    }
  }
};

const knexQuery = require('./fixtures/knexquery');
const knexQueryErr = require('./fixtures/knexqueryerror');

describe('Monitor :: Knex', () => {

  before((done) => {

    new Monitor(knex, plugin.options);
    knex.client.emit('start', builder);

    plugin.options.reporters.consoleReporter = new EventEmitter;

    done();
  });

  it('start knex monitor for query event', (done) => {

    plugin.options.reporters.consoleReporter.once('consolelog', function(result){

      expect(result.object).equal('knex');
      expect(result.event).equal('query');
      expect(result.sql).equal(knexQuery.sql);
      done();
    });

    builder.emit('query', knexQuery);
  });

  it('start knex monitor for query error event', (done) => {

    plugin.options.reporters.consoleReporter.once('consolelog', function(result){

      expect(result.object).equal('knex');
      expect(result.event).equal('queryerror');
      expect(result.message).equal(knexQueryErr.message);
      done();
    });

    builder.emit('query-error', knexQueryErr);
  });

  it('start knex monitor for error event', (done) => {

    plugin.options.reporters.consoleReporter.once('consolelog', function(result){

      expect(result.object).equal('knex');
      expect(result.event).equal('error');
      expect(result.message).equal(knexQueryErr.message);
      done();
    });

    builder.emit('error', knexQueryErr);
  });

  it('start knex monitor for successful query execution', (done) => {

    plugin.options.reporters.consoleReporter.once('consolelog', function(result){

      expect(result.object).equal('knex');
      expect(result.event).equal('end');
      done();
    });

    builder.emit('end');
  });

  it('knex console reporters is null', (done) => {

    plugin.options.reporters.console.knex = null;
    builder.emit('end');
    expect('').equal('');
    done();
  });

  it('knex client as null', (done) => {

    new Monitor({}, plugin);
    expect('').equal('');
    done();
  });

});
