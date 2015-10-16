'use strict';

var Base = require('base-methods');
var utils = require('./lib/utils');

function Target(options) {
  if (!(this instanceof Target)) {
    return new Target(options);
  }
  Base.call(this);
  this.is('Target');
  this.define('plugins', []);
  this.options = options || {};
  this.use(utils.option);
  this.files = [];
}

Base.extend(Target, {
  use: function (fn) {
    utils.is(this, 'Target');
    var plugin = fn.call(this, this);
    if (typeof plugin === 'function') {
      this.plugins.push(plugin);
    }
    return this;
  },

  run: function (config) {
    this.plugins.forEach(function (fn) {
      config.use(fn);
    });
    return config;
  },

  config: function(config) {
    var orig = utils.clone(config);
    var target = this;

    var expandFiles = utils.expandFiles(this.options);
    this.run(expandFiles);

    config = expandFiles.expand(config);

    var opts = utils.merge({}, this.options, config.options);
    if (opts.process === 'target' || opts.process === true) {
      var ctx = utils.merge({}, orig, config);
      config = this.process(config, ctx);
    }

    if (opts.process === 'task' || opts.process === 'parent') {
      config = this.process(config, opts.parent);
    }

    this.use(function fn(files) {
      if (!files.isFiles) return fn;
      var options = utils.merge({}, target.options, files.options);
      var type = options.process;
      if (type === 'files' || type === true || type === 'all') {
        files = target.process(files);
      }
    });

    this.run(config);
    utils.forOwn(config, function (val, key) {
      if (key === 'options') {
        target.option(val);

      } else if (utils.has(utils.optsKeys, key)) {
        target.option(key, val);

      } else if (key === 'files') {
        target[key] = val.map(function (node) {
          target.extendFiles(node);
          target.run(node);
          return node;
        });

      } else {
        target.set(key, val);
      }
    });

    if (opts.process === 'all') {
      config = this.process(config, opts.parent);
      config = this.process(this);
    }
    return this;
  },

  extendFiles: function(config) {
    if (this.name) utils.define(config, 'name', this.name);
    if (this.task) utils.define(config, 'task', this.task);
  },

  process: function(config, context) {
    return utils.process(this.options)(config, context || config);
  }
});



/**
 * Expose `Target`
 */

module.exports = Target;
