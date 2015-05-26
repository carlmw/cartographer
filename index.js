var request = require('request');
var tokenize = require('html-tokenize');
var url = require('url');
var resourceFinder = require('./lib/resource-finder');
var through = require('through2');

function discover(rootUrl) {
  var rs = through.obj(),
    queue = 0;

  function findAssets(targetUrl) {
    queue++;

    var target = url.parse(targetUrl);
    var assets = request(targetUrl)
    .pipe(tokenize())
    .pipe(resourceFinder());


    assets
    .on('data', function (asset) {
      if ('anchor' === asset[0]) {
        var assetUrl = url.resolve(targetUrl, asset[1]);

        if (target.host !== url.parse(assetUrl).host) {
          return;
        }

        findAssets(assetUrl);
      }

      rs.push(asset.concat(target.path));
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
