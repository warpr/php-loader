/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

//var loaderUtils = require("loader-utils");

// @See https://webpack.github.io/docs/how-to-write-a-loader.html
// @See https://webpack.github.io/docs/loaders.html

module.exports = function(content) {
  // this.cacheable && this.cacheable();

  var resource = this.resource;
  var cwd = this.context;

  // this.addDependency(headerPath); -> mark a dependancy for watching and cachable mode
  // Use the this.resolve function to resolve the path -> get the content???
  // this.callback(err, values...)

  //var query = loaderUtils.parseQuery(this.query);
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

  // this.resource
  // this.resourcePath
  // this.resourceQuery
  var callback = this.async();

  child = require('child_process').spawn('php', [ resource ], { cwd: cwd });
  var self = this;

  // Send data to the child process via its stdin stream
  // child.stdin.write(content);
  child.stdin.end();

  // Listen for any response from the child:
  var fullFile = "";
  var fullError = "";

  child.stdout.on('data', function (data) {
    fullFile += data;
  });

  // Listen for any errors:
  child.stderr.on('data', function (data) {
    fullError += data;
  });

  child.stdout.on('end', function () {
    if (!fullError) {
      callback(null, fullFile);
    }
  });

  child.stderr.on('end', function () {
    if (fullError) {
      self.emitError(fullError);
      callback(fullError);
    }
  });
}
