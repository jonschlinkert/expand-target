'use strict';

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
  this.define('orig', utils.clone(config));

  // utils.define the task name (if exists)
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
  config = expandFiles.call(this, this)(config);

  utils.forIn(config, function (val, key) {
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
    var opts = utils.pick(config, utils.optsKeys);
    config = utils.omit(config, utils.optsKeys);

    config.options = utils.merge({}, config.options, opts);
    if (current.parent && current.parent.options) {
      config.options = utils.merge({}, current.parent.options, config.options);
    }

    var expand = utils.expand(config.options);
    config = processConfig(name, config, current);
    var ctx = utils.merge({}, config, config.options, config.root);
    config = expand(config, ctx);
    return config;
  };
}

function processConfig(name, config, current) {
  var parent = current.parent || config.parent || {};
  // resolve templates using the `current` object as context
  var process = config.options.process;
  if (!process || (name === 'target' && process === 'node')) {
    return config;
  }

  var ctx = {};
  var expand = utils.expand(config.options);

  // process `<%= foo %>` config templates
  if (process === name) {
    if (name === 'node') {
      config = expand(config);
    }
    ctx = utils.merge({}, current.orig, config);
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
  return config;
}

/**
 * Ensure that basic `files` properties are utils.defined
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
    config.files.push(utils.pick(config, ['src', 'dest']));
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
      file.options = utils.merge({}, opts, file.options);
      utils.define(file, 'parent', config);

      // utils.merge `config.options`
      var ele = normalizeOpts('node', config)(file);
      if (target.task) ele.task = target.task;

      // expand 'path-objects': 'files: [{'foo/': 'bar/*.js'}]`
      var mapping = toMapping(ele, config);
      if (mapping.files) {
        // if a `files` property exists, then start-over
        // on the newly expanded 'path-object' patterns
        return expandFiles(target)(mapping);
      }

      // utils.merge `config.files`
      var conf = new utils.Files();
      var res = conf.expand(ele);
      files = files.concat(res.cache.files);
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
  node = utils.omit(node, omissions);

  // extend non-files config properties onto the node
  var nonfiles = utils.omit(config, ['files']);
  config = utils.merge({}, node, nonfiles);
  return config;
}

/**
 * Expose `Target`
 */

module.exports = Target;
