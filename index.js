'use strict';

var utils = require('expand-utils');
var util = require('./utils');
var use = require('use');

/**
 * Create a new Target with the given `options`
 *
 * ```js
 * var target = new Target();
 * target.expand({src: '*.js', dest: 'foo/'});
 * ```
 * @param {Object} `options`
 * @api public
 */

function Target(options) {
  if (!(this instanceof Target)) {
    return new Target(options);
  }

  utils.is(this, 'target');
  use(this);

  this.options = options || {};
  if (utils.isTarget(options)) {
    this.options = {};
    this.addFiles(options);
    return this;
  }
}

/**
 * Expand src-dest mappings and glob patterns in
 * the given `target` config.
 *
 * @param {Object} `target`
 * @return {Object}
 * @api public
 */

Target.prototype.addFiles = function(target) {
  var config = new util.Expand(this.options);

  // run plugins on `config`, then config can
  // pass plugins down the tree
  utils.run(this, 'target', config);
  config.expand(target);

  for (var key in config) {
    if (config.hasOwnProperty(key) && !(key in this)) {
      this[key] = config[key];
    }
  }
  return this;
};

/**
 * Expose `Target`
 */

module.exports = Target;
