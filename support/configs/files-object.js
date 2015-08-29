var toTarget = require('../format');

/**
 * `toFormat` is used to generate formatted examples for the docs.
 */

var config = toTarget('files-objects', 'supports files objects', {
  files: {
    'a/': ['*.js'],
    'b/': ['*.js'],
    'c/': ['*.js'],
  }
});
console.log(config)

var config = toTarget('files-objects', 'expanded files object', {
  expand: true,
  files: {
    'a/': ['*.js'],
    'b/': ['*.js'],
    'c/': ['*.js'],
  }
});
console.log(config)
