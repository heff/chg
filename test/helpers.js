'use strict';

var fs = require('fs');

exports.loadFixture = function(fileName) {
  return fs.readFileSync('../test/fixtures/'+fileName, 'utf8');
}

exports.readChangelog = function() {
  return fs.readFileSync('./CHANGELOG.md', 'utf8');
}

exports.resetFixture = function(fileName) {
  const content = fs.readFileSync('../test/fixtures/'+fileName, 'utf8');
  return fs.writeFileSync('./CHANGELOG.md', content, 'utf8');
}