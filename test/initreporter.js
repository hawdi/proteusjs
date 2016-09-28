'use strict';

// Load modules

const Code = require('code');
const Lab = require('lab');
const Stream = require('stream');
const Util = require('util');

// Test shortcuts
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;
const before = lab.before;

const Reporter = require('../lib/initreporter');

const plugin = {
  options: {
    reporters: { },
  }
};

describe('Reporter :: Console', () => {

  it('pass initialized console reporter', (done) => {

    function ProteusjsStream() {

      if (!(this instanceof ProteusjsStream)) {
        return new ProteusjsStream({ objectMode: true });
      }

      // init Transform
      Stream.Transform.call(this, { objectMode: true });
    };

    Util.inherits(ProteusjsStream, Stream.Transform);

    ProteusjsStream.prototype._transform = function (data, encoding, next) {
      expect(data.test).equal('yes');
      next(done());
    };

    plugin.options.reporters.console = ProteusjsStream;
    Reporter.init(plugin.options);
    plugin.options.reporters.logit.emit('logit', { test : 'yes' });

  });

});
