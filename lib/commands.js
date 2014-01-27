/*
 * commands
 *
 * shared functions between cli and grunt
 * commands include prompts to ask the user for certain values
 */

'use strict';

var chg = require('./chg.js');
var prompt = require('prompt');

var commands = module.exports = {};

commands.init = function(options, callback){
  chg.init(options, callback);
};

commands.add = function(line, options, callback){
  if (line) {
    chg.add(line, options, callback);
  } else {
    textPrompt('Add one line to the changelog', function(err, text){
      if (err) { return callback(err); }
      chg.add(text, {}, callback);
    });
  }
};

commands.release = function(version, options, callback){
  if (version) {
    chg.release(version, options, callback);
  } else {
    textPrompt('What is the release version number?', function(err, text){
      if (err) { return callback(err); }
      chg.release(text, options, callback);
    });
  }
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

function textPrompt(message, callback){
  prompt.start();
  prompt.get({
    name: 'text',
    message: message,
    required: true
  }, function (err, result) {
    if (err) { 
      return callback(err); 
    }
    callback(result.text);
  });
}