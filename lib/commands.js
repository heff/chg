/*
 * commands
 *
 * shared functions between cli and grunt
 * commands include prompts to ask the user for certain values
 */

'use strict';

var chg = require('./chg.js');
var prompt = require('prompt');
var fs = require('fs');

var commands = module.exports = {};

commands.init = function(options, callback){
  chg.init(options, callback);
};

commands.add = function(line, options, callback){
  if (line) {
    chg.add(line, options, callback);
  } else {
    textPrompt('Add one line to the changelog', {}, function(err, text){
      if (err) { return callback(err); }
      chg.add(text, {}, callback);
    });
  }
};

commands.release = function(version, options, callback){
  options = options || {};

  if (version) {
    chg.release(version, options, callback);
  } else {
    // use current package.json version as the default prompt value
    if (fs.existsSync('./package.json')) {
      options.default = require(process.cwd() + '/package.json').version;
    }

    if (options.noprompt) {
      if (!options.default) { return callback(new Error('Version number unknown, abort')); }
      chg.release(options.default, options, callback);
    } else {
      textPrompt('What is the release version number?', options, function(err, text){
        if (err) { return callback(err); }
        chg.release(text, options, callback);
      });
    }

  }
};

commands.find = function(version, options, callback){
  options = options || {};

  if (version) {
    return chg.find(version, options, callback);
  }

  textPrompt('What release version number are you looking for?', options, function(err, text){
    if (err) { return callback(err); }

    chg.find(text, options, callback);
  });
};

commands.delete = function(options, callback){
  prompt.start();
  prompt.get({
    name: 'yesno',
    message: 'Are you sure you want to delete the changelog?',
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
    default: 'yes'
  }, function (err) {
    if (err) { return callback(err); }
    chg.delete(options, callback);
  });
};

function textPrompt(message, options, callback){
  if (!options) {
    callback = options;
    options = {};
  }

  options.name = 'text';
  options.message = message;
  options.required = true;

  prompt.start();
  prompt.get(options, function (err, result) {
    if (err) {
      return callback(err);
    }
    callback(null, result.text);
  });
}
