'use strict';

require('mocha');
require('should');
var util = require('util');
var assert = require('assert');
var Target = require('..');
var target;

describe('targets', function () {
  beforeEach(function() {
    target = new Target();
  });

  describe('files', function () {
    it('should expose a "files" property', function () {
      target = new Target({src: '*'});
      assert(target.files);
      assert(target.files);
      assert(Array.isArray(target.files));
    });

    it('should expand files-objects', function () {
      target = new Target({
        files: {
          'a/': ['*.js'],
          'b/': ['*.js'],
          'c/': ['*.js']
        }
      });
      assert(target.files.length);
    });

    it('should use plugins', function () {
      target.use(function fn(config) {
        if (!config.node) return fn;
        config.dest += 'foo/';
      });

      target.expand({
        files: {
          'a/': ['*.js'],
          'b/': ['*.js'],
          'c/': ['*.js']
        }
      });

      assert(target.files[0].dest === 'a/foo/');
      assert(target.files[1].dest === 'b/foo/');
      assert(target.files[2].dest === 'c/foo/');
    });

    it('should arrayify the `files` property', function () {
      target.expand({files: {src: 'a', dest: 'b'}});
      assert(Array.isArray(target.files));
    });

    it('should support `files` as an array of strings:', function () {
      target.expand({files: ['*.js']});
      assert(target.files[0].src.length > 0);
    });

    it('should arrayify the `src` property', function () {
      target.expand({files: {src: 'a', dest: 'b'}});
      assert(Array.isArray(target.files[0].src));
    });

    it('should expand `src` glob patterns:', function () {
      target.expand({src: 'test/fixtures/*.txt'});
      target.files[0].src.should.containEql('test/fixtures/a.txt');
    });

    it('should use a `cwd` to expand `src` glob patterns:', function () {
      target.expand({src: '*.txt', cwd: 'test/fixtures'});
      assert.equal(target.files[0].src[0], 'a.txt');
      assert.equal(target.files[0].src[1], 'b.txt');
      assert.equal(target.files[0].src[2], 'c.txt');
    });
  });

  describe('options.expand', function () {
    describe('when expand is true', function () {
      it('should join the `cwd` to expanded `src` paths:', function () {
        target.expand({src: '*.txt', cwd: 'test/fixtures', mapDest: true});
        assert.equal(target.files[0].src[0], 'test/fixtures/a.txt');
        assert.equal(target.files[1].src[0], 'test/fixtures/b.txt');
        assert.equal(target.files[2].src[0], 'test/fixtures/c.txt');
      });

      it('should create `dest` properties using the src path:', function () {
        target.expand({
          src: 'test/fixtures/*.txt',
          mapDest: true
        });
        assert.equal(target.files[0].dest, 'test/fixtures/a.txt');
      });

      it('should expand `src` paths to src-dest mappings:', function () {
        target.expand({src: 'test/fixtures/*.txt', mapDest: true});
        assert.equal(target.files[0].src[0], 'test/fixtures/a.txt');
        assert.equal(target.files[0].dest, 'test/fixtures/a.txt');
      });

      it('should strip cwd from dest mappings:', function () {
        target.expand({src: '*.txt', cwd: 'test/fixtures', mapDest: true});
        assert.equal(target.files[0].src[0], 'test/fixtures/a.txt');
        assert.equal(target.files[0].dest, 'a.txt');
      });

      it('should expand `src-dest` mappings:', function () {
        target.expand({
          src: 'test/fixtures/*.txt',
          mapDest: true
        });
        assert.equal(target.files[0].src[0], 'test/fixtures/a.txt');
      });

      it('should expand files objects:', function () {
        target.expand({
          files: {
            'dest/a.js': ['*.js', 'aaa.js'],
            'dest/b.js': ['*.js', 'bbb.js'],
          }
        });

        target.files[0].src.should.containEql('utils.js');
        target.files[0].dest.should.equal('dest/a.js');
        target.files[1].src.should.containEql('utils.js');
        target.files[1].dest.should.equal('dest/b.js');
      });
    });
  });
});
