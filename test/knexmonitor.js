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
    reporter: {
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

describe('Monitor :: Knex ', () => {

  before((done) => {

    new Monitor(knex, plugin.options);
    knex.client.emit('start', builder);
    done();
  });

  it('start knex monitor for query event', (done) => {

    plugin.options.reporter.consoleReporter = new EventEmitter;
    plugin.options.reporter.consoleReporter.once('consolelog', function(result){

      expect(result.object).equal('knex');
      expect(result.event).equal('query');
      expect(result.sql).equal(knexQuery.sql);
      done();
    });

    builder.emit('query', knexQuery);
  });

  /*it('knex client as null', (done) => {

    new Monitor({}, plugin);
    done();
  });*/
});
