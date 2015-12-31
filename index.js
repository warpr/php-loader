/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

//var loaderUtils = require("loader-utils");

// @See https://webpack.github.io/docs/how-to-write-a-loader.html
// @See https://webpack.github.io/docs/loaders.html

module.exports = function(content) {
  // this.cacheable && this.cacheable();

  var callback = this.async();

  // this.addDependency(headerPath); -> mark a dependancy for watching and cachable mode
  // Use the this.resolve function to resolve the path -> get the content???
  // this.callback(err, values...)

  //var query = loaderUtils.parseQuery(this.query);

  // this.resource
  // this.resourcePath
  // this.resourceQuery

  child = require('child_process').spawn('php'); //, [ '-v' ]);
  var self = this;

  // Send data to the child process via its stdin stream
  child.stdin.write(content);
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
