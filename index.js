var request = require('request');
var tokenize = require('html-tokenize');
var url = require('url');
var resourceFinder = require('./lib/resource-finder');
var through = require('through2');

function discover(rootUrl) {
  var rs = through.obj(),
    searched = [],
    queue = 0;

  function findAssets(targetUrl) {
    queue++;

    var target = url.parse(targetUrl);
    var assets = request(targetUrl)
    .pipe(tokenize())
    .pipe(resourceFinder());

    // Keep a stash of the pages we've already visited
    searched.push(target.path);

    assets
    .on('data', function (asset) {
      if ('anchor' === asset[0]) {
        var assetUrl = url.resolve(targetUrl, asset[1]);
        assetUrl = url.parse(assetUrl);

        // The link does not reside on the same host so skip it
        if (target.host !== assetUrl.host) {
          return;
        }

        // If we haven't scrapped this page already then continue
        if (searched.indexOf(assetUrl.path) === -1) {
          findAssets(assetUrl.href);
        }
      }

      rs.push(asset.concat(target.path));
    })
    .on('end', function () {
      queue--;
      // If all of our requests are complete close the stream
      if (0 === queue) {
        rs.push(null);
      }
    });

    return assets;
  }

  findAssets(rootUrl);

  return rs;
}

module.exports = { discover: discover };
