var inspect = require('stringify-object');
var target = require('./');

function stringify(config) {
  var obj = JSON.parse(JSON.stringify(config));
  return inspect(obj, {
    singleQuotes: true,
    indent: '  '
  });
}
var targets = [
  {
    expand: true,
    dest: 'dist/',
    src: '{.*,*.*}'
  },
  {
    src: 'test/fixtures/*.js',
    dest: 'site/assets/'
  },
  {
    flatten: true,
    expand: true,
    files: [
      {src: 'test/fixtures/*.txt', dest: 'site/assets/'},
      {src: ['test/fixtures/*.js', 'test/fixtures/*.txt'], dest: 'site/assets/'}
    ]
  },
  {
    files: [
      {src: 'test/fixtures/*.js', dest: 'site/assets/'},
      {src: 'test/fixtures/*.js', dest: 'site/assets/'},
      {src: 'test/fixtures/*.js', dest: 'site/assets/'},
    ]
  },
  {
    cwd: 'test/fixtures',
    files: [
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
    ]
  },
  {
    cwd: 'test/fixtures',
    expand: true,
    files: [
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
    ]
  },
  {
    options: {
      cwd: 'test/fixtures',
      expand: true,
    },
    files: [
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
    ]
  },
  {
    src: '*.txt',
    expand: true
  },
  {
    files: {
      'dist/': ['*.js'],
    }
  },
  {
    expand: true,
    files: {
      'dist/': ['*.js'],
    }
  }
];
