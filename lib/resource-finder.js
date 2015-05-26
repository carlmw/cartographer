var through = require('through2');

var SCRIPT_RE = /^<script/i,
  SRC_RE = /src=\"(.+)\"/i,
  STYLESHEET_RE = /^<link/i,
  HREF_RE = /href=\"(.+)\"/i

function findAssets(data, enc, next) {
  if ('open' !== data[0]) {
    return next();
  }

  var tag = data[1].toString();
  if (tag.match(SCRIPT_RE)) {
    return next(null, ['script', tag.match(SRC_RE)[1]]);
  }
  if(tag.match(STYLESHEET_RE)) {
    return next(null, ['stylesheet', tag.match(HREF_RE)[1]]);
  }
  next();
}


module.exports = function resourceFinder() {
  return through.obj(findAssets);
};
