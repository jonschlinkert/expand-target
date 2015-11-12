'use strict';

var use = require('use');
var utils = require('./utils');

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
  utils.define(this, '_name', 'Target');
  use(this);

  this.options = options || {};
  if (utils.isTarget(options)) {
    this.options = {};
    this.expand(options);
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

Target.prototype.expand = function(target) {
  var config = new utils.Expand(this.options);
  utils.run(this, 'expand', config);
  config.expand(target);

  for (var key in config) {
    if (!(key in this)) {
      this[key] = config[key];
    }
  }
};

/**
 * Expose `Target`
 */

module.exports = Target;
