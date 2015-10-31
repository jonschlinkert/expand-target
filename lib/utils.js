'use strict';

/**
 * Module dependencies
 */

var Base = require('base-methods');
var utils = require('lazy-cache')(require);
var cache = {};

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('for-in');
require('expand');
require('base-methods', 'Base');
require('clone-deep', 'clone');
require('define-property', 'define');
require('expand-files', 'Files');
require('mixin-deep', 'merge');
require('object.omit', 'omit');
require('object.pick', 'pick');

/**
 * Restore `require`
 */

require = fn;


utils.Node = function Node(config, parent, root) {
  Base.call(this, config || {});
  this.define('parent', parent);
  this.define('root', root);
};

/**
 * Expose `Node`
 */

Base.extend(utils.Node);


utils.nextId = function nextId(key) {
  if (!cache.hasOwnProperty(key)) cache[key] = 0;
  return key + '_' + cache[key]++;
};

utils.arrayify = function arrayify(val) {
  return Array.isArray(val) ? val : [val];
};

utils.isNode = function isNode(val, key) {
  return typeof val === 'object'
    && !Array.isArray(val)
    && key !== 'options';
};

utils.hasValues = function hasValues(obj, keys) {
  for (var key in obj) {
    if (keys.indexOf(key) > -1) return true;
  }
  return false;
};

/**
 * Object keys for validation checks
 */

utils.taskKeys = [
  'options'
];

utils.targetKeys = [
  'files',
  'src',
  'dest'
];

utils.optsKeys = [
  'base',
  'cwd',
  'destBase',
  'expand',
  'ext',
  'extDot',
  'extend',
  'filter',
  'flatten',
  'glob',
  'process',
  'rename',
  'srcBase',
  'statType',
  'transform'
];

utils.methodsKeys = [
  'get',
  'set',
  'del',
  'define',
  'visit',
  'normalize'
];

utils.allKeys = utils.taskKeys
  .concat(utils.targetKeys)
  .concat(utils.optsKeys);


/**
 * Expose `utils` modules
 */

module.exports = utils;
