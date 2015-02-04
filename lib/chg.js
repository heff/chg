/*
 * chg
 * https://github.com/heff/chg
 *
 * Copyright (c) 2014 heff
 * Licensed under the Apache license.
 */

'use strict';

var chg = module.exports = {};

var fs = require('fs');
var shell = require('shelljs');
var moment = require('moment');
var semver = require('semver');

var changeLogFile = 'CHANGELOG.md';
var unreleasedTitle = '## HEAD (Unreleased)\n';
var noItems = '_(none)_';
var divider = '--------------------\n\n';

var ERR_NO_CHANGELOG = changeLogFile+' does not exist. Change to the directory where it does exist, or run `init` to create one in the current directory.';

function defCallback(){}

function getChangeLog(){
  if (!fs.existsSync(changeLogFile)) {
    return null;
  }
  return fs.readFileSync(changeLogFile, 'utf8');
}

/**
* Callbacks are standard "node style"
* @callback chgCallback
* @param {object} Error
* @param {string} responseMessage
*/

/**
* Creates CHANGELOG.md if it does not exist.
* @param {object} options
* @param {chgCallback} callback - successfull returns the new changelog file.
*/
chg.init = function(options, callback){
  options = options || {};
  callback = callback || defCallback;

  if (fs.existsSync(changeLogFile)){
    return callback(new Error(changeLogFile + ' already exists'));
  }

  var contents = 'CHANGELOG\n=========\n\n';
  contents += unreleasedTitle + noItems + '\n\n' + divider;

  fs.writeFileSync(changeLogFile, contents, 'utf8');

  callback(null, changeLogFile);
};

/**
* Deletes CHANGELOG.md
* @param {object} options
* @param {chgCallback} callback - success returns the deleted changelog file.
*/
chg.delete = function(options, callback){
  options = options || {};
  callback = callback || defCallback;

  if (!fs.existsSync(changeLogFile)) {
    return callback(new Error(changeLogFile+' does not exist'));
  }

  shell.rm(changeLogFile);
  callback(null, changeLogFile);
};

/**
* Add a new line to CHANGELOG.md
* @param {string} line - the new line to be added
* @param {object} options
* @param {chgCallback} callback - success returns the newly added line
*/
chg.add = function(line, options, callback){
  var contents, sections, top;

  options = options || {};
  callback = callback || defCallback;

  // get existing contents
  contents = getChangeLog();
  if (!contents) {
    return callback(new Error(ERR_NO_CHANGELOG));
  }

  // if 'noItems' is there, remove it
  contents = contents.replace(unreleasedTitle + noItems + '\n', unreleasedTitle);

  // split on the divider including preceding newline
  sections = contents.split('\n'+divider);
  // add new line to the unreleased section
  top = sections[0] + '* ' + line + '\n\n';

  // combine new contents and write file
  contents = top + divider + sections[1];
  fs.writeFileSync(changeLogFile, contents, 'utf8');

  callback(null, line);
};

/**
* Creates a new release by bumping the version, moving everything in the unreleased head to a new section headed by the new version (and creating a new, empty head)
* @param {string} version - what kind of release this is, either 'major', 'minor', or 'patch'
* @param {object} options
* @param {string} options.date - date of the new release (defaults to the current date)
* @param {string} options.version - release type to create (if version param is null)
* @param {chgCallback} callback - success returns the newly added line
*/
chg.release = function(version, options, callback){
  var date, contents, changes, title, pkgVersion;

  callback = callback || defCallback;
  options = options || {};
  date = options.date || moment().format('YYYY-MM-DD');
  version = version || options.version || null;

  if (!version) return callback(new Error('Version required'));

  // allow incrementing version for a release type
  if (['major','minor','patch'].indexOf(version) !== -1) {
    if (fs.existsSync('./package.json')) {
      pkgVersion = require(process.cwd()+'/package.json').version;
      version = semver.inc(pkgVersion, version);
    } else {
      callback(new Error('No package.json was found'));
    }
  }

  // get existing contents
  contents = getChangeLog();
  if (!contents) {
    return callback(new Error(ERR_NO_CHANGELOG));
  }

  // get everything after the unreleased title
  changes = contents.split(unreleasedTitle)[1];
  // get only the unreleased changes
  changes = changes.split('\n\n')[0];
  // replace unreleased changes with noItems
  contents = contents.replace(changes, noItems);

  // build new release title
  title = '##' + ' ' + version + ' ('+ date +')\n';
  // add title at the top of the release section
  contents = contents.replace(divider, divider + title + changes + '\n\n');

  fs.writeFileSync(changeLogFile, contents, 'utf8');

  callback(null, { title: title, changes: changes, changelog: contents });
  return changes;
};
