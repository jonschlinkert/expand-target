'use strict';

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);
require = utils;
require('expand', 'process');
require('expand-files');
require('base-options', 'option');
require('define-property', 'define');
require('clone-deep', 'clone');
require('mixin-deep', 'merge');
require('for-own', 'forOwn');
require('for-in', 'forIn');

/**
 * Return true if an array has the given value
 */

utils.has = function(keys, key) {
  return keys.indexOf(key) > -1;
};

utils.is = function(obj, name) {
  utils.define(obj, 'is' + name, true);
  utils.define(obj, '_name', 'is' + name);
  return obj;
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

module.exports = utils;
