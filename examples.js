var inspect = require('stringify-object');
var merge = require('mixin-deep');
var Target = require('./target');
var utils = require('./lib/utils');
var forIn = require('for-in');

function stringify(config) {
  var obj = JSON.parse(JSON.stringify(config));
  return inspect(obj, {
    singleQuotes: true,
    indent: '  '
  });
}
var tasks = {
  assemble: {
    a: {
      foo: 'bar',
      expand: true,
      dest: 'dist/',
      src: '{.*,*.*}'
    },
    b: {
      src: 'test/fixtures/*.js',
      dest: 'site/assets/'
    }
  },
  verb: {
    c: {
      flatten: true,
      expand: true,
      files: [
        {src: 'test/fixtures/*.txt', dest: 'site/assets/'},
        {src: ['test/fixtures/*.js', 'test/fixtures/*.txt'], dest: 'site/assets/'}
      ]
    },
    d: {
      files: [
        {src: 'test/fixtures/*.js', dest: 'site/assets/'},
        {src: 'test/fixtures/*.js', dest: 'site/assets/'},
        {src: 'test/fixtures/*.js', dest: 'site/assets/'},
      ]
    }
  }
  // {
  //   cwd: 'test/fixtures',
  //   files: [
  //     {src: '*.js', dest: 'site/assets/'},
  //     {src: '*.js', dest: 'site/assets/'},
  //     {src: '*.js', dest: 'site/assets/'},
  //   ]
  // },
  // {
  //   cwd: 'test/fixtures',
  //   expand: true,
  //   files: [
  //     {src: '*.js', dest: 'site/assets/'},
  //     {src: '*.js', dest: 'site/assets/'},
  //     {src: '*.js', dest: 'site/assets/'},
  //   ]
  // },
  // {
  //   options: {
  //     cwd: 'test/fixtures',
  //     expand: true,
  //   },
  //   files: [
  //     {src: '*.js', dest: 'site/assets/'},
  //     {src: '*.js', dest: 'site/assets/'},
  //     {src: '*.js', dest: 'site/assets/'},
  //   ]
  // },
  // {
  //   src: '*.txt',
  //   expand: true
  // },
  // {
  //   files: {
  //     'dist/': ['*.js'],
  //   }
  // },
  // {
  //   expand: true,
  //   files: {
  //     'dist/': ['*.js'],
  //   }
  // }
};


var res = {options: {}, targets: {}};
function targets(config) {
  forIn(config, function (val, key) {
    if (key !== 'options' && utils.optsKeys.indexOf(key) === -1) {
      var target = new Target(key);
      target.config(val);
      res.targets[key] = target;
    } else {
      merge(res.options, val);
    }
  });
}

targets(tasks.assemble);
targets(tasks.verb);

// var target = new Target('site');
// target.config(tasks.assemble.site);
console.log(res.targets)
