'use strict';

var Base = require('base-methods');
var utils = require('./lib/utils');

function Target(name, options) {
  if (!(this instanceof Target)) {
    return new Target(name, options);
  }

  if (typeof name !== 'string') {
    options = name;
    name = null;
  }

  Base.call(this);
  this.options = options || {};
  this.files = [];
  this.name = name;

  if (!this.name) {
    this.config(options);
    return this;
  }
}

Base.extend(Target);

Target.prototype.config = function(config) {
  var orig = utils.clone(config);

  var fn = utils.files(this.options);
  config = fn.expand(config);

  var opts = utils.merge({}, this.options, config.options);
  if (opts.process === 'target' || opts.process === true) {
    var ctx = utils.merge({}, orig, config);
    config = this.process(config, ctx);
  }

  if (opts.process === 'task' || opts.process === 'parent') {
    config = this.process(config, opts.parent);
  }

  utils.forOwn(config, function (val, key) {
    if (key === 'options') {
      this.option(val);
    } else if (utils.has(utils.optsKeys, key)) {
      this.option(key, val);
    } else if (key === 'files') {
      val = val.map(function (node) {
        var nodeOpts = utils.merge({}, opts, node.options);
        var proc = nodeOpts.process;
        if (proc === 'node' || proc === true || proc === 'all') {
          node = this.process(node);
        }
        if (this.name) node.name = this.name;
        if (this.task) node.task = this.task;
        return node;
      }.bind(this));
      this.set(key, val);
    } else {
      this.set(key, val);
    }
  }, this);

  if (opts.process === 'all') {
    config = this.process(config, opts.parent);
    config = this.process(this);
  }
  return this;
};

Target.prototype.option = function(key, value) {
  if (typeof key === 'object') {
    this.visit('option', key);
  } else {
    this.set('options.' + key, value);
  }
  return this;
};

Target.prototype.process = function(config, context) {
  return utils.expand(this.options)(config, context || config);
};

/**
 * Expose `Target`
 */

module.exports = Target;
