#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var through = require('through2');
var Cartographer = require('../');

Cartographer
.discover(argv._[0])
.pipe(through.obj(function (data, enc, next) {
  next(null, JSON.stringify(data) + '\n');
}))
.pipe(process.stdout)
.on('end', function () {
  process.exit(1);
});
