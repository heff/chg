'use strict';

var fs = require('fs');

function loadFixture(fileName) {
  return fs.readFileSync('../test/fixtures/'+fileName, 'utf8');
}

function readChangelog() {
  return fs.readFileSync('./CHANGELOG.md', 'utf8');
}

// These helpers are only used in the test suite, so we'll add them to the
// global namespace to avoid having to retype helpers every time.
global.loadFixture = module.exports['loadFixture'] = loadFixture;
global.readChangelog = module.exports['readChangelog'] = readChangelog;
