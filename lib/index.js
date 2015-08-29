'use strict';

var forIn = require('for-in');
var expand = require('expand');
var pick = require('object.pick');
var omit = require('object.omit');
var merge = require('mixin-deep');
var clone = require('clone-deep');
var Files = require('expand-files');
var reserved = require('./reserved');
var utils = require('./utils');

/**
 * Normalize options. If a `parent` object exists,
 * and it has an `options` object, it will be used
 * to extend the config.
 */

function normalizeOpts(name, current, resv) {
  resv = resv || reserved.options;

  return function(config) {
    config.options = config.options || {};

    forIn(config, function (val, key) {
      if (~resv.indexOf(key)) {
        config.options[key] = config[key];
        delete config[key];
      } else {
        validate(key);
      }
    });

    if (current.parent && current.parent.options) {
      config.options = merge({}, current.parent.options, config.options);
    }

    // resolve templates using the `current` object as context
    var process = config.options.process;
    if (!process) return config;

    var ctx = {};

    // process `<%= foo %>` config templates
    if (process === name) {
      if (name === 'node') {
        config = expand(config);
      }
      ctx = merge({}, current.orig, config);
      config = expand(config, ctx);
    } else if (name === 'node' && process === 'target') {
      config = expand(config, current.orig);
    } else if (name === 'node' && process === 'task') {
      config = expand(config, current.parent.orig);
    } else if (name === 'target' && process === 'task') {
      config = expand(config, current.parent.orig);
    } else if (process === 'all') {
      if (name === 'node') {
        config = expand(config);
      }
      config = expand(config, current.orig);
      config = expand(config, current.parent.orig);
    }

    ctx = merge({}, config, config.options, config.root);
    config = expand(config, ctx);
    return config;
  };
}

/**
 * Ensure that basic `files` properties are defined
 * before trying to expand them.
 *
 * ```js
 * // before
 * {src: 'a', dest: 'b', options: { foo: 'bar' }}
 * // after
 * {options: { foo: 'bar' }, files: [ { src: 'a', dest: 'b' } ]}
 * ```
 */

function normalizeFiles(config) {
  config.files = utils.arrayify(config.files || []);
  var files = pick(config, ['src', 'dest']);
  // account for `src` being a getter
  for (var key in files) {
    if (key) config.files.push(files);
    break;
  }
  delete config.src;
  delete config.dest;
  return config;
}

/**
 * Expand a files array into normalized `src-dest` mappings.
 *
 * ```js
 * // before:
 * { src: '*.txt' }
 *
 * // after:
 * // [ { src: [ 'test/fixtures/a.txt' ], dest: 'a.txt' },
 * //   { src: [ 'test/fixtures/b.txt' ], dest: 'b.txt' },
 * //   { src: [ 'test/fixtures/c.txt' ], dest: 'c.txt' } ]
 * ```
 */

function expandFiles(target) {
  return function(config) {
    var obj = omit(config, ['files', 'options']);
    var len = config.files.length, i = -1;
    var files = [];

    while (++i < len) {
      var node = clone(obj);

      if (target.task) node.task = target.task;
      if (target.target) node.target = target.target;

      // merge `config.options`
      var ele = normalizeOpts('node', target)(config.files[i]);
      ele.options = merge({}, config.options, ele.options);

      // expand 'path-objects': 'files: [{'foo/': 'bar/*.js'}]`
      var mapping = toMapping(ele, config);
      if (mapping.files) {
        // if a `files` property exists, then
        // 'path-object' patterns were expanded
        return expandFiles(target)(mapping);
      }
      // merge `config.files`
      node = merge({}, node, ele);
      files = files.concat(new Files(node));
    }
    config.files = files;
    return config;
  };
}

/**
 * Expand files-objects into an array of `src-dest` mappings.
 *
 * ```js
 * target.toMapping({
 *   'foo/': ['bar/*.js']
 * });
 * //=> {files: [{src: ['bar/*.js'], dest: 'foo/'}]}
 * ```
 */

function toMapping(node, config) {
  if ('src' in node || 'dest' in node) {
    return node;
  }

  var keys = Object.keys(node);
  config = config || {};

  node.files = utils.arrayify(node.files || []);
  var omissions = [];
  var opts = node.options;

  keys.forEach(function (key) {
    if (reserved.all.indexOf(key) < 0) {
      omissions.push(key);
      var mapping = {src: node[key], dest: key};
      if (opts) mapping.options = opts;
      node.files.push(mapping);
      delete node[key];
    }
  });

  // omit the original 'path-objects' from the node
  node = omit(node, omissions);

  // extend non-files config properties onto the node
  var nonfiles = omit(config, ['files']);
  return merge({}, node, nonfiles);
}


function validate(name) {
  if (~reserved.methods.indexOf(name)) {
    throw new Error(name + ' is a reserved target-level property.');
  }
}


exports.normalizeOpts = normalizeOpts;
exports.normalizeFiles = normalizeFiles;
exports.expandFiles = expandFiles;
exports.toMapping = toMapping;
