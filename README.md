# php loader for webpack

This package will load any php content and use php to turn it into a html page.

Ex:

## Installation

`npm install php-loader`

## Usage

``` javascript
var fileContent = require("php!./file.php");
// => run file.php with php and return it as some content (html for example)
```

It can also be used inside the webpack configuration file (webpack.js):


``` javascript
module.exports = {
  ...
  module: {
    loaders: [
      ...
      {
        test: /\.php$/,
        loaders: [
          'html-minify',
          'php-loader'
        ]
      },
      ...
    ]
  },
  ...
}
```

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
