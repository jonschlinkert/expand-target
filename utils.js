'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('base-plugins', 'plugins');
require('define-property', 'define');
require('expand-files', 'Expand');
require = fn;

utils.bubbleEvents = function(Expand, target) {
  var emit = Expand.prototype.emit;
  Expand.prototype.emit = function(key, val) {
    if (key === 'files') {
      target.emit.apply(target, arguments);
      return emit.apply(Expand.prototype, arguments);
    }
  };
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
