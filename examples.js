
var Target = require('./');

var tasks = {
  options: {
    cwd: 'test/fixtures'
  },

  assemble: {
    site: {
      mapDest: true,
      dest: 'dist/',
      src: '{.*,*.*}'
    },
    docs: {
      src: 'test/fixtures/*.js',
      dest: 'site/assets/'
    }
  },

  verb: {
    docs: {
      flatten: true,
      mapDest: true,
      files: [
        {src: 'test/fixtures/*.txt', dest: 'site/assets/'},
        {src: ['test/fixtures/*.js', 'test/fixtures/*.txt'], dest: 'site/assets/'}
      ]
    }
  },

  site: {
    files: [
      {src: 'test/fixtures/*.js', dest: 'site/assets/'},
      {src: 'test/fixtures/*.js', dest: 'site/assets/'},
      {src: 'test/fixtures/*.js', dest: 'site/assets/'},
    ]
  },

  docs: {
    cwd: 'test/fixtures',
    files: [
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
    ]
  },

  not_a_task: {
    cwd: 'test/fixtures',
    mapDest: true
  },

  blog: {
    cwd: 'test/fixtures',
    mapDest: true,
    files: [
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
    ]
  },

  showcase: {
    options: {
      cwd: 'test/fixtures',
      mapDest: true,
    },
    files: [
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
      {src: '*.js', dest: 'site/assets/'},
    ]
  },

  microsite: {
    mapDest: true,
    src: '*.txt'
  },

  js: {
    files: {
      'dist/': ['*.js'],
    }
  },

  css: {
    mapDest: true,
    files: {
      'dist/': ['*.css'],
    }
  }
};

/**
 * TARGET
 */

var target = new Target();
target.use(function fn(val)  {
  console.log(val)
  return fn;
});

target.expand({
  src: 'test/fixtures/*.txt',
  dest: 'foo'
});
