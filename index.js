'use strict';

var forIn = require('for-in');
var expand = require('expand');
var define = require('define-property');
var clone = require('clone-deep');
var pick = require('object.pick');
var omit = require('object.omit');
var merge = require('mixin-deep');
var Files = require('expand-files');
var utils = require('./lib/utils');
var Node = utils.Node;

function Target(name, config, parent) {
  if (!(this instanceof Target)) {
    return new Target(name, config, parent);
  }

  if (typeof name !== 'string') {
    parent = config;
    config = name;
    name = null;
  }

  if (typeof config !== 'object') {
    throw new TypeError('expected config to be an object.');
  }

  var root = parent ? (parent.root || parent.orig) : this.orig;

  // Inherit `Node`
  Node.call(this, null, parent, root || this);

  // clone the original config object on a non-enumerable prop
  this.define('orig', clone(config));

  // define the task name (if exists)
  if (this.parent && (this.parent.task)) {
    this.define('task', this.parent.task);
  }

  // set the target name, or generate an id
  this.define('name', name || utils.nextId('target'));

  // normalize the config object
  this.normalize(config);
}
Node.extend(Target);

/**
 * Normalize files and options
 */

Target.prototype.normalize = function(config) {
  config = normalizeFiles(config);
  config = normalizeOpts('target', this)(config);
  config = expandFiles(this)(config);

  forIn(config, function (val, key) {
    this.set(key, val);
  }, this);
};

/**
 * Normalize options. If a `parent` object exists,
 * and it has an `options` object, it will be used
 * to extend the config.
 */

function normalizeOpts(name, current) {
  return function(config) {
    var parent = current.parent || config.parent || {};
    var opts = pick(config, utils.optsKeys);
    config = omit(config, utils.optsKeys);

    config.options = merge({}, config.options, opts);
    if (current.parent && current.parent.options) {
      config.options = merge({}, current.parent.options, config.options);
    }

    // resolve templates using the `current` object as context
    var process = config.options.process;
    if (!process || (name === 'target' && process === 'node')) {
      return config;
    }

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
      config = expand(config, parent.orig || parent);
    } else if (name === 'target' && process === 'task') {
      config = expand(config, parent.orig || parent);
    } else if (process === 'all') {
      if (config.files) {
        config.files = config.files.map(function (file) {
          return expand(file);
        });
      }
      config = expand(config, current.orig);
      config = expand(config, parent.orig || parent);
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

  for (var i = 0; i < config.files.length; i++) {
    var ele = config.files[i];
    if (typeof ele === 'string') {
      config.files[i] = {src: ele};
    }
  }

  if ('src' in config || 'dest' in config) {
    config.files.push(pick(config, ['src', 'dest']));
    delete config.src;
    delete config.dest;
  }
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
    var len = config.files.length, i = -1;
    var opts = config.options;
    var files = [];

    while (++i < len) {

      var file = config.files[i];
      file.options = merge({}, opts, file.options);
      define(file, 'parent', config);

      // merge `config.options`
      var ele = normalizeOpts('node', config)(file);
      if (target.task) ele.task = target.task;
      ele.name = target.name;

      // expand 'path-objects': 'files: [{'foo/': 'bar/*.js'}]`
      var mapping = toMapping(ele, config);
      if (mapping.files) {
        // if a `files` property exists, then start-over
        // on the newly expanded 'path-object' patterns
        return expandFiles(target)(mapping);
      }

      // merge `config.files`
      files = files.concat(new Files(ele));
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
  node.files = utils.arrayify(node.files || []);
  var opts = node.options;
  var omissions = [];

  keys.forEach(function (key) {
    if (utils.allKeys.indexOf(key) < 0) {
      omissions.push(key);
      var mapping = {src: node[key], dest: key};
      mapping.options = opts;
      node.files.push(mapping);
      delete node[key];
    }
  });

  // omit the original 'path-objects' from the node
  node = omit(node, omissions);

  // extend non-files config properties onto the node
  var nonfiles = omit(config, ['files']);
  config = merge({}, node, nonfiles);

  if (typeof config.options.transform === 'function') {
    config = config.options.transform(config);
  }
  return config;
}

/**
 * Expose `Target`
 */

module.exports = Target;
