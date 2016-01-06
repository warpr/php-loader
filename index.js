/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

// @See https://webpack.github.io/docs/how-to-write-a-loader.html
// @See https://webpack.github.io/docs/loaders.html

//var loaderUtils = require("loader-utils");

module.exports = function(content) {
  var resource = this.resource;
  var cwd = this.context;

  // this.addDependency(headerPath); -> mark a dependancy for watching and cachable mode
  // this.cacheable && this.cacheable(); -> mark the file as cachable (true if dependancies are marked)
  // var query = loaderUtils.parseQuery(this.query);

  // Sync run
  // @see https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options
  // var child = require('child_process').spawnSync('php', [ resource ], { cwd: cwd, timeout: 1000 });
  // console.log("R " + resource, " #" + child.status);
  // if (child.status) {
  //   throw new Error("problem with " + resource)
  // } else {
  //   return child.stdout.toString();
  // }
  // return "euh?"

  var callback = this.async();

  child = require('child_process').spawn('php', [ resource ], { cwd: cwd });
  var self = this;

  // Send data to the child process via its stdin stream
  // child.stdin.write(content);
  child.stdin.end();

  // Listen for any response from the child:
  var fullFile = "";
  var fullError = "";

  // Keep track of wich buffer is closed, since we can not determine it ourself.
  var outIsClosed = false;
  var errIsClosed = false;

  function endOfPhp() {
    if (outIsClosed && errIsClosed) {
      if (fullError) {
        self.emitError(fullError);
        callback(fullError);
      } else {
        callback(null, fullFile);
      }
    }
  }

  // Listen for content:
  child.stdout.on('data', function (data) {
    fullFile += data;
  });

  // Listen for errors:
  child.stderr.on('data', function (data) {
    fullError += data;
  });

  // When strout is closed, is the process ended?
  child.stdout.on('end', function () {
    outIsClosed = true;
    endOfPhp();
  });

  // When strerr is closed, is the process ended?
  child.stderr.on('end', function () {
    errIsClosed = true;
    endOfPhp();
  });
}
