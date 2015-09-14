'use strict';

/**
 * Lazily required module dependencies
 */

var lazy = require('lazy-cache')(require);
lazy('expand', 'expand');
lazy('expand-files', 'files');
lazy('clone-deep', 'clone');
lazy('mixin-deep', 'merge');
lazy('for-own', 'forOwn');

/**
 * Return true if an array has the given value
 */

lazy.has = function has(keys, key) {
  return keys.indexOf(key) > -1;
};

/**
 * Object keys for validation checks
 */

lazy.taskKeys = [
  'options'
];

lazy.targetKeys = [
  'files',
  'src',
  'dest'
];

lazy.optsKeys = [
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

lazy.methodsKeys = [
  'get',
  'set',
  'del',
  'define',
  'visit',
  'normalize'
];

lazy.allKeys = lazy.taskKeys
  .concat(lazy.targetKeys)
  .concat(lazy.optsKeys);

module.exports = lazy;
