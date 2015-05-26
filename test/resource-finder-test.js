var expect = require('chai').use(require('chai-things')).expect;
var Readable = require('stream').Readable
var tokenize = require('html-tokenize');

var resourceFinder = require('../lib/resource-finder');

function createStream(string) {
  var stream = new Readable();
  stream.push(string);
  stream.push(null);
  return stream;
}

function findResourcesIn(string, done) {
  var assets = [];

  createStream(string)
  .pipe(tokenize())
  .pipe(resourceFinder())
  .on('data', function (asset) {
    assets.push(asset);
  })
  .on('end', function () {
    done(assets);
  });
}

describe('resourceFinder', function () {
  it('finds stylesheets', function (done) {
    findResourcesIn('<link rel="stylesheet" href="boop.css" />', function (assets) {
      expect(assets).to.contain.something.that.eqls(['stylesheet', 'boop.css']);
      done();
    });
  });

  it('finds scripts', function (done) {
    findResourcesIn('<script src="app.js"></script>', function (assets) {
      expect(assets).to.contain.something.that.eqls(['script', 'app.js']);
      done();
    });
  });

  it('ignores link tags with no rel attribute', function (done) {
    findResourcesIn('<link href="foo.css" />', function (assets) {
      expect(assets.length).to.equal(0);
      done();
    });
  });

  it('ignores script tags with no src attribute', function (done) {
    findResourcesIn('<script>', function (assets) {
      expect(assets.length).to.equal(0);
      done();
    });
  });
});
