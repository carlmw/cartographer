var expect = require('chai').use(require('chai-things')).expect;
var connect = require('connect');
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

  function findAssets(rootUrl, done) {
    var results = [];
    Cartographer.discover(rootUrl)
    .on('data', function (asset) {
      results.push(asset);
    })
    .on('end', function () {
      done(results);
    });
  }

  it('finds scripts and stylesheets', function (done) {
    findAssets('http://localhost:8001/simple.html', function (assets) {
      expect(assets).to.contain.something.that.eqls(['script', 'app.js']);
      expect(assets).to.contain.something.that.eqls(['stylesheet', 'style.css']);
      expect(assets.length).to.eql(2);
      done();
    });
  });

  it('finds assets on other pages', function (done) {
    findAssets('http://localhost:8001/parent.html', function (assets) {
      expect(assets).to.contain.something.that.eqls(['script', 'child-asset.js']);
      expect(assets.length).to.eql(2);
      done();
    });
  });
});
