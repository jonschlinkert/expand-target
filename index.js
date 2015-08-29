'use strict';

var forIn = require('for-in');
var clone = require('clone-deep');
var Node = require('./lib/node');
var utils = require('./lib/utils');
var methods = require('./lib');

function Target(name, config, parent) {
  if (!(this instanceof Target)) {
    return new Target(name, config, parent);
  }

  if (typeof name !== 'string') {
    parent = config;
    config = name;
    name = 'target_' + utils.id.next('target');
  }

  Node.call(this, null, parent);
  this.define('orig', config ? clone(config) : {});
  if (parent && (parent.task || parent.name)) {
    this.define('task', parent.task || parent.name);
  }

  this.define('target', name);
  this.normalize(config);
}

Node.extend(Target);

Target.prototype.normalize = function(config) {
  config = methods.normalizeOpts('target', this)(config);
  config = methods.normalizeFiles(config);
  config = methods.expandFiles(this)(config);

  forIn(config, function (val, key) {
    if (utils.isNode(val, key)) {
      this.set(key, new Node(val, this));
    } else {
      this.set(key, val);
    }
  }, this);
};

/**
 * Expose `Target`
 */

module.exports = Target;
