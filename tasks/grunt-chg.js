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

  function callback(err, success){
    if (err) {
      return grunt.log.error(err);
    } else if (success) {
      grunt.log.writeln(success);
    }
  }

  grunt.registerTask('chg-init', 'Create the CHANGELOG.md file', function() {
    commands.init({}, callback);
  });

  grunt.registerTask('chg-add', 'Add a line to the changelog', function() {
    commands.add(null, {}, callback);
  });

  grunt.registerTask('chg-release', 'Add a new release and move unrleased changes under it', function() {
    commands.release(null, {}, callback);
  });

  grunt.registerTask('chg-delete', 'Delete the changelog', function() {
    commands.release({}, callback);
  });
};
