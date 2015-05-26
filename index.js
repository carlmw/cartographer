var request = require('request');
var tokenize = require('html-tokenize');
var url = require('url');
var resourceFinder = require('./lib/resource-finder');

function discover(targetUrl) {
  return request(targetUrl)
  .pipe(tokenize())
  .pipe(resourceFinder());
}

module.exports = { discover };
