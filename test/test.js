'use strict';

var util = require('util');
var assert = require('assert');
var should = require('should');
var utils = require('../lib/utils');
var Target = require('../');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

function containEql(actual, expected) {
  var len = expected.length;
  var alen = actual.length;
  len = Math.min(len, alen);

  while (len--) {
    var a = actual[len];
    var b = expected[len];

    a.src.should.eql(b.src);
    a.dest.should.equal(b.dest);
  }
}

describe('targets', function () {
  describe('constructor', function () {
    it('should set a target `name` when passed as the first arg.', function () {
      var target = new Target('foo', {src: 'a', dest: 'b'});
      assert.equal(target.name, 'foo');
    });

    it('should add a parent property if parent is passed:', function () {
      var target = new Target('foo', {}, {});
      assert.deepEqual(target.parent, {});
    });

    it('should add a `task` property if passed on parent:', function () {
      var a = new Target({}, {task: 'jshint'});
      assert.equal(a.task, 'jshint');
      var b = new Target({}, {task: 'assemble'});
      assert.equal(b.task, 'assemble');
    });

    it('should return an instance when `new` is not defined:', function () {
      var target = Target('foo', {}, {});
      assert(target instanceof Target);
    });

    it('should throw an error when config is not an object:', function () {
      (function () {
        Target('foo');
      }).should.throw('expected config to be an object.');
    });
  });

  describe('options', function () {
    it('should move `reserved` properties to `options`', function () {
      var target = new Target({cwd: 'foo'});
      target.should.have.property('options');
      target.options.should.have.property('cwd');
    });

    it('should not move non-reserved properties to `options`', function () {
      var target = new Target({foo: 'bar'});
      target.should.have.property('options');
      target.options.should.not.have.property('foo');
    });

    it('should extend node options with target options', function () {
      var target = new Target({options: {a: 'b'}, src: 'a', foo: 'bar'});

      target.should.have.property('options');
      target.options.should.have.property('a');
      target.should.have.property('files');
      target.files[0].should.have.property('options');
      target.files[0].options.should.have.property('a');
    });
  });

  describe('parent', function () {
    it('should extend target.options with task options.', function () {
      var task = {options: {foo: 'bar'}};
      var target = new Target({src: 'a', dest: 'b'}, task);
      target.should.have.property('options');
      target.options.should.have.property('foo', 'bar');
    });

    it('should not overwrite existing target.options with task options.', function () {
      var task = {options: {foo: 'bar'}};
      var target = new Target({
        src: 'a',
        dest: 'b',
        options: {
          foo: 'baz'
        }
      }, task);
      target.should.have.property('options');
      target.options.should.have.property('foo', 'baz');
    });
  });

  describe('files', function () {
    it('should move `src` and `dest` to files.', function () {
      var target = new Target('lint', {src: 'a', dest: 'b'});
      target.should.have.property('files');
      target.files[0].should.have.properties(['src', 'dest']);
      target.should.not.have.properties(['src', 'dest']);
    });

    it('should arrayify the `files` property', function () {
      var target = new Target({files: {src: 'a', dest: 'b'}});
      assert(Array.isArray(target.files));
    });

    it('should support `files` as an array of strings:', function () {
      var target = new Target({files: ['*.js']});
      assert(target.files[0].src.length > 0);
    });

    it('should arrayify the `src` property', function () {
      var a = new Target({files: {src: 'a', dest: 'b'}});
      assert(Array.isArray(a.files[0].src));
    });

    it('should expand `src` glob patterns:', function () {
      var target = new Target({src: 'test/fixtures/*.txt'});
      target.files[0].src.should.containEql('test/fixtures/a.txt');
    });

    it('should set the `task` property on a files object:', function () {
      var target = new Target({files: {src: 'a', dest: 'b'}}, {task: 'jshint'});
      assert(target.files[0].task === 'jshint');
    });

    it('should set the target `name` property on a files object:', function () {
      var target = new Target('foo', {files: {src: 'a', dest: 'b'}}, {task: 'jshint'});
      assert(target.files[0].name === 'foo');
      assert(target.files[0].task === 'jshint');
    });

    it('should use a `cwd` to expand `src` glob patterns:', function () {
      var target = new Target({src: '*.txt', cwd: 'test/fixtures'});
      target.files[0].src.should.containEql('test/fixtures/a.txt');
      target.files[0].src.should.containEql('test/fixtures/b.txt');
      target.files[0].src.should.containEql('test/fixtures/c.txt');
    });
  });

  describe('options.expand', function () {
    describe('when expand is true', function () {
      it('should join the `cwd` to expanded `src` paths:', function () {
        var target = new Target({src: '*.txt', cwd: 'test/fixtures', expand: true});
        target.files[0].src.should.containEql('test/fixtures/a.txt');
        target.files[1].src.should.containEql('test/fixtures/b.txt');
        target.files[2].src.should.containEql('test/fixtures/c.txt');
      });

      it('should create `dest` properties using the src path:', function () {
        var target = new Target('abc', {
          src: 'test/fixtures/*.txt',
          expand: true
        });
        assert(target.files[0].dest === 'test/fixtures/a.txt');
      });

      it('should expand `src` paths to src-dest mappings:', function () {
        var target = new Target({src: 'test/fixtures/*.txt', expand: true});
        containEql(target.files, [{
          src: ['test/fixtures/a.txt'],
          dest: 'test/fixtures/a.txt'
        }, {
          src: ['test/fixtures/b.txt'],
          dest: 'test/fixtures/b.txt'
        }]);
      });

      it('should strip cwd from dest mappings:', function () {
        var target = new Target({src: '*.txt', cwd: 'test/fixtures', expand: true});
        containEql(target.files, [{
          src: ['test/fixtures/a.txt'],
          dest: 'a.txt'
        }, {
          src: ['test/fixtures/b.txt'],
          dest: 'b.txt'
        }]);
      });

      it('should expand `src-dest` mappings:', function () {
        var target = new Target({
          src: 'test/fixtures/*.txt',
          expand: true
        });
        target.files[0].src.should.containEql('test/fixtures/a.txt');
      });

      it('should expand files objects:', function () {
        var target = new Target({
          files: {
            'dest/a.js': ['src/aa.js', 'src/aaa.js'],
            'dest/b.js': ['src/bb.js', 'src/bbb.js'],
          }
        });
        target.files[0].src.should.eql(['src/aa.js', 'src/aaa.js']);
        target.files[0].dest.should.equal('dest/a.js');
        target.files[1].src.should.eql(['src/bb.js', 'src/bbb.js']);
        target.files[1].dest.should.equal('dest/b.js');
      });
    });
  });

  describe('target nodes', function () {
    describe('options.process', function () {
      it('should resolve templates in reserved options values:', function () {
        var target = new Target({
          src: '*.txt',
          cwd: '<%= foo %>',
          process: true,
          expand: true,
          foo: 'arbitrary'
        });
        target.options.cwd.should.equal('arbitrary');
      });

      it('should process in the context of a node:', function () {
        var task = {foo: 'task'};
        var target = new Target('jshint', {
          options: {process: 'node'},
          foo: 'target',
          files: [
            {src: 'test/fixtures/*.txt', foo: '<%= bar %>', bar: 'node'}
          ],
        }, task);
        target.files[0].foo.should.equal('node');
      });

      it('should process in the context of a target:', function () {
        var task = {foo: 'task'};
        var target = new Target('jshint', {
          options: {process: 'target'},
          foo: '<%= bar %>',
          bar: 'target',
          src: 'test/fixtures/*.txt',
        }, task);
        target.foo.should.equal('target');
      });

      it('should process templates in the context of a task:', function () {
        var task = {foo: 'task', bar: 'baz'};
        var target = new Target('jshint', {
          options: {process: 'task'},
          foo: '<%= bar %>',
          src: '<%= foo %>/*.txt',
        }, task);
        target.foo.should.equal('baz');
        assert(target.files[0].src, 'task/*.txt');
      });

      it('should process in all contexts:', function () {
        var task = {foo: 'task', bar: 'baz', c: '<%= foo %>'};
        var target = new Target('jshint', {
          options: {process: 'all'},
          a: '<%= b %>',
          b: '<%= c %>',
          c: 'd',
          files: [
            {src: 'test/fixtures/*.txt', foo: '<%= bar %>', bar: 'node'}
          ],
        }, task);

        target.a.should.equal('d');
        target.b.should.equal('d');
        target.c.should.equal('d');
        target.files[0].foo.should.equal('node');
      });

      it('should resolve templates in arbitrary config values:', function () {
        var target = new Target({
          src: '*.txt',
          cwd: '<%= foo %>',
          process: 'target',
          expand: true,
          foo: 'arbitrary',
          bar: '<%= options.cwd %>',
          baz: '<%= cwd %>',
        });

        /**
         * should (just) work...
         */

        // on reserved properties that are moved to options
        target.options.cwd.should.equal('arbitrary');

        // on templates for reserved properties that are moved to options
        target.bar.should.equal('arbitrary');

        // on the `orig` value of reserved properties
        target.baz.should.equal('arbitrary');
      });
    });
  });

  describe('options.transform', function () {
    it('should modify the result with a custom transform function', function () {
       var actual = new Target('foo', {
        options: {
          transform: function (config) {
            config.pipeline = function(){};
            return config;
          }
        },
        src: ['*.js']
      });
      assert(typeof actual.files[0].pipeline === 'function');
    });

    it('should work when `expand` is true:', function () {
       var actual = new Target('foo', {
        options: {
          expand: true,
          transform: function (config) {
            config.pipeline = function(){};
            return config;
          }
        },
        files: {'foo/': '*.js'}
      });
      assert(typeof actual.files[0].pipeline === 'function');
    });

    it('should work with a files array:', function () {
       var actual = new Target('foo', {
        options: {
          expand: true,
          transform: function (config) {
            config.pipeline = function(){};
            return config;
          }
        },
        files: ['*.js']
      });
      assert(typeof actual.files[0].pipeline === 'function');
    });
  });
});

/* deps: mocha */
