var expect = require('chai').use(require('chai-things')).expect;
var connect = require('connect');
var concat = require('concat-stream');
var serveStatic = require('serve-static');
var Cartographer = require('../');

describe('Cartographer', function () {
  var app;
  before(function () {
    app = connect()
    .use(serveStatic(__dirname + '/fixtures'))
    .listen(8001);
  });

  after(function () {
    app.close();
  });

  it('finds scripts and stylesheets', function (done) {
    var results = [];
    Cartographer.discover('http://localhost:8001/simple.html')
    .on('data', function (asset) {
      results.push(asset);
    })
    .on('end', function () {
      expect(results).to.contain.something.that.eqls(['script', 'app.js']);
      expect(results).to.contain.something.that.eqls(['stylesheet', 'style.css']);
      done();
    });
  });
});
