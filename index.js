var request = require('request');
var tokenize = require('html-tokenize');
var url = require('url');
var resourceFinder = require('./lib/resource-finder');
var through = require('through2');

function discover(rootUrl) {
  var rs = through.obj(),
    queue = 0;

  function findAssets(targetUrl) {
    var path = url.parse(targetUrl).path;

    queue++;
    var assets = request(targetUrl)
    .pipe(tokenize())
    .pipe(resourceFinder());

    assets
    .on('data', function (asset) {
      rs.push(asset.concat(path));
      if ('anchor' === asset[0]) {
        var assetUrl = url.resolve(targetUrl, asset[1]);
        findAssets(assetUrl);
      }
    })
    .on('end', function () {
      queue--;
      if (0 === queue) {
        rs.push(null);
      }
    });

    return assets;
  }

  findAssets(rootUrl);

  return rs;
}

module.exports = { discover };
