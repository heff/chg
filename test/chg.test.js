'use strict';

var expect = require('chai').expect;
var helpers = require('./helpers');
var shell = require('shelljs');
var fs = require('fs');
var chg = require('../');

describe('chg', function(){
  var tmpDirName;

  before(function(){
    tmpDirName = 'test-tmp-'+(new Date().getTime());
    shell.mkdir('-p', tmpDirName);
    shell.cd(tmpDirName);
  });

  after(function() {
    shell.cd('..');
    shell.rm('-rf', tmpDirName);
  });


  describe('#init()', function(){
    var chgResult;

    before(function() { chgResult = chg.init(); });

    it('creates a new, empty CHANGELOG.md', function(){
      expect(readChangelog()).to.equal(loadFixture('init.md'));
    });

    it('returns the new changelog filename', function() {
      expect(chgResult).to.equal('CHANGELOG.md');
    });
  });

  describe('#add()', function() {
    var addResult;

    before(function() { addResult = chg.add('Test add'); });

    it('adds a new line to the changelog', function() {
      expect(readChangelog()).to.equal(loadFixture('add.md'));
    });

    it('returns the newly added line', function() {
      expect(addResult).to.equal('Test add');
    });
  });

  describe('#release()', function() {
    var releaseResult, releaseTitle, releaseDate;

    before(function() {
      releaseTitle = '0.0.1';
      releaseDate = '12/12/12';
      releaseResult = chg.release(releaseTitle, { date: releaseDate });
    });

    it('moves things under head to a new release block', function() {
      expect(readChangelog()).to.equal(loadFixture('release.md'));
    })

    describe('return information', function() {
      it('includes the title', function() {
        expect(releaseResult.title).to.contain(releaseTitle);
      });

      it('includes the date in the title', function() {
        expect(releaseResult.title).to.contain(releaseDate);
      });

      it('includes the changes', function() {
        expect(releaseResult.changes).to.contain('Test add');
      });

      it('includes the entire changelog contents', function() {
        expect(releaseResult.changelog).not.to.be.null;
      });
    });

    describe('subsequent releases', function() {
      it('adds new lines under HEAD', function() {
        chg.add('Test add again');
        chg.add('Test add with [link](http://heff.me)');
        expect(readChangelog()).to.equal(loadFixture('add2.md'));
      });

      it('creates a release with the correct title above the previous release', function() {
        chg.release('0.0.2', { date: '12/13/12' });
        expect(readChangelog()).to.equal(loadFixture('release2.md'));
      });
    });
  });

  describe('#find()', function() {
    var findTitle, findResult;

    before(function() {
      findTitle = '0.0.2';
      findResult = chg.find(findTitle);
    });

    it('finds the section under the specified title', function() {
      expect(findResult.title).to.contain(findTitle);
    });

    it('returns an array of the changes', function() {
      expect(findResult.changes).to.be.instanceOf(Array);
      expect(findResult.changes).to.include('* Test add again');
    });

    it('returns the contents under that title as raw text', function() {
      expect(findResult.changesRaw).to.contain('Test add with');
      expect(findResult.changesRaw).to.contain('Test add again');
    });

    it
  });

  describe('#delete()', function() {
    before(function() {
      chg.delete();
    });

    it('deletes the current CHANGELOG.md file', function() {
      expect(fs.existsSync('./CHANGELOG.md')).to.be.false;
    });
  });
});
