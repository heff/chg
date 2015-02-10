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

var changeLogFile = 'CHANGELOG.md';
var unreleasedTitle = '## HEAD (Unreleased)\n';
var noItems = '_(none)_';
var divider = '--------------------\n\n';

var ERR_NO_CHANGELOG = changeLogFile+' does not exist. Change to the directory where it does exist, or run `init` to create one in the current directory.';

function noopCallback(){}

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
* @returns {string} changelog filename
*/
chg.init = function(options, callback){
  options = options || {};
  callback = callback || noopCallback;

  if (fs.existsSync(changeLogFile)){
    var err = new Error(changeLogFile + ' already exists')
    callback(err);
    throw err;
  }

  var contents = 'CHANGELOG\n=========\n\n';
  contents += unreleasedTitle + noItems + '\n\n' + divider;

  fs.writeFileSync(changeLogFile, contents, 'utf8');


  callback(null, changeLogFile);

  return changeLogFile;
};

/**
* Deletes CHANGELOG.md
* @param {object} options
* @param {chgCallback} callback - success returns the deleted changelog file
* @returns {string} changelog filename
*/
chg.delete = function(options, callback){
  options = options || {};
  callback = callback || noopCallback;

  if (!fs.existsSync(changeLogFile)) {
    var err = new Error(changeLogFile+' does not exist')
    callback(err);
    throw err;
  }

  shell.rm(changeLogFile);

  callback(null, changeLogFile);

  return changeLogFile;
};

/**
* Add a new line to CHANGELOG.md
* @param {string} line - the new line to be added
* @param {object} options
* @param {chgCallback} callback - success returns the newly added line
* @returns {string} the new line added
*/
chg.add = function(line, options, callback){
  var contents, sections, top;

  options = options || {};
  callback = callback || noopCallback;

  // get existing contents
  contents = getChangeLog();
  if (!contents) {
    var err = new Error(ERR_NO_CHANGELOG)
    callback(err);
    throw err;
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

  return line;
};

/**
* Creates a new release by bumping the version, moving everything in the unreleased head to a new section headed by the new version (and creating a new, empty head)
* @param {string} version - the new release (this will be the title for the changelog)
* @param {object} options
* @param {string} options.date - date of the new release (defaults to the current date)
* @param {string} options.version - release type to create (if version param is null)
* @param {chgCallback} callback - success returns an object containing the new changes
* @returns {object} changeData
* @returns {object} changeData.title - new title to be created
* @returns {object} changeData.changes - list of changes added under the new title
* @returns {object} changeData.changelog - entire changelog contents
*/
chg.release = function(version, options, callback){
  var date, contents, changes, title;

  callback = callback || noopCallback;
  options = options || {};
  date = options.date || moment().format('YYYY-MM-DD');
  version = version || options.version || null;

  if (!version) {
    var err = new Error('Version required')
    return callback(err);
    throw err;
  }

  // get existing contents
  contents = getChangeLog();
  if (!contents) {
    var err = new Error(ERR_NO_CHANGELOG);
    callback(err);
    throw err;
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

  var changeData = { title: title, changes: changes, changelog: contents };
  callback(null, changeData);

  return changeData;
};
