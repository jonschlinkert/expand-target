var toTarget = require('../format');

/**
 * `toFormat` is used to generate formatted examples for the docs.
 */

var config = toTarget('example', {
  flatten: true,
  expand: true,
  files: [
    {src: 'test/fixtures/*.txt', dest: 'site/assets/'},
    {src: ['test/fixtures/*.js', 'test/fixtures/*.txt'], dest: 'site/assets/'}
  ]
});
console.log(config)

var config = toTarget('example', {
  files: [
    {src: 'test/fixtures/*.js', dest: 'site/assets/'},
    {src: 'test/fixtures/*.js', dest: 'site/assets/'},
    {src: 'test/fixtures/*.js', dest: 'site/assets/'},
  ]
});
console.log(config)

var config = toTarget('example', {
  cwd: 'test/fixtures',
  files: [
    {src: '*.js', dest: 'site/a/'},
    {src: '*.js', dest: 'site/b/'},
    {src: '*.js', dest: 'site/c/'},
  ]
});
console.log(config)

var config = toTarget('example', {
  cwd: 'test/fixtures',
  expand: true,
  files: [
    {src: '*.js', dest: 'site/assets/'},
    {src: '*.js', dest: 'site/assets/'},
    {src: '*.js', dest: 'site/assets/'},
  ]
});
console.log(config)

var config = toTarget('example', {
  options: {
    cwd: 'test/fixtures',
    expand: true,
  },
  files: [
    {src: '*.js', dest: 'site/assets/'},
    {src: '*.js', dest: 'site/assets/'},
    {src: '*.js', dest: 'site/assets/'},
  ]
});
console.log(config)
