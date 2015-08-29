var toTarget = require('../format');

/**
 * `toFormat` is used to generate formatted examples for the docs.
 */

var config = toTarget('src-dest', 'Supports `src-dest` mappings', {
  src: 'test/fixtures/*.js',
  dest: 'site/assets/'
});
console.log(config)


var config = toTarget('src-dest', 'Supports `src-dest` mappings', {
  expand: true,
  src: 'test/fixtures/*.js',
  dest: 'site/assets/'
});
console.log(config)

