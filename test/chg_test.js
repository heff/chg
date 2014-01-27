'use strict';

var chg = require('../lib/chg.js');
var fs = require('fs');
var shell = require('shelljs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function fixture(fileName){
  return fs.readFileSync('../test/fixtures/'+fileName, 'utf8');
}

function output(){
  return fs.readFileSync('./CHANGELOG.md', 'utf8');
}

exports['chg'] = {
  setUp: function(done) {
    // create a temp folder for changelog test files
    this.dirName = 'test-tmp-'+(new Date().getTime());
    shell.mkdir('-p', this.dirName);
    shell.cd(this.dirName);

    done();
  },
  tearDown: function(done){
    // delete the test folder
    shell.cd('..');
    shell.rm('-rf', this.dirName);

    done();
  },
  'changelog actions': function(test) {
    test.expect(6);

    chg.init();
    test.equal(output(), fixture('init.md'), 'init failed');

    chg.add('Test add');
    test.equal(output(), fixture('add.md'), 'add failed');

    chg.release('0.0.1', { date: '12/12/12' });
    test.equal(output(), fixture('release.md'), 'release failed');

    chg.add('Test add again');
    chg.add('Test add with [link](http://heff.me)');
    test.equal(output(), fixture('add2.md'), 'add 2 failed');

    chg.release('0.0.2', { date: '12/13/12' });
    test.equal(output(), fixture('release2.md'), 'release 2 failed');

    chg.delete();
    test.ok(!fs.existsSync('./CHANGELOG.md'));

    test.done();
  }
};