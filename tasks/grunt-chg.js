/*
 * grunt-chg
 * https://github.com/heff/chg
 *
 * Copyright (c) 2014 heff
 * Licensed under the MIT license.
 */

'use strict';

var commands = require('../lib/commands.js');

module.exports = function(grunt) {
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  function getCallback(done) {
    return function(err, success){
      if (err) {
        return grunt.log.error(err);
      } else if (success) {
        grunt.log.writeln(success);
        done();
      }
    }
  }

  grunt.registerTask('chg-init', 'Create the CHANGELOG.md file', function() {
    var done =  this.async();
    commands.init({}, getCallback(done));
  });

  grunt.registerTask('chg-add', 'Add a line to the changelog', function(line) {
    var done =  this.async();
    commands.add(line, {}, getCallback(done));
  });

  grunt.registerTask('chg-release', 'Add a new release and move unrleased changes under it', function(version) {
    var done =  this.async();
    commands.release(version, {}, getCallback(done));
  });

  grunt.registerTask('chg-delete', 'Delete the changelog', function() {
    var done =  this.async();
    commands.release({}, getCallback(done));
  });
};
