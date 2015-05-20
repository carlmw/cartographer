var request = require('request');
var tokenize = require('html-tokenize');
var url = require('url');
var through = require('through2');

var SCRIPT_RE = /^<script/i,
  SRC_RE = /src=\"(.+)\"/i,
  STYLESHEET_RE = /^<link/i,
  HREF_RE = /href=\"(.+)\"/i

function filterOpenTags(data, enc, next) {
  if ('open' === data[0]) {
    this.push(data[1]);
  }
  next();
}

function filterAssets(data, enc, next) {
  var tag = data.toString();
  if (tag.match(SCRIPT_RE)) {
    return next(null, ['script', tag.match(SRC_RE)[1]]);
  }
  if(tag.match(STYLESHEET_RE)) {
    return next(null, ['stylesheet', tag.match(HREF_RE)[1]]);
  }
  next();
}

function discover(targetUrl) {
  return request(targetUrl)
  .pipe(tokenize())
  .pipe(through.obj(filterOpenTags))
  .pipe(through.obj(filterAssets));
}

module.exports = { discover };
