'use strict';

var Base = require('base-methods');
var cache = {};

/**
 * Expose `utils`
 */

var utils = module.exports;

function Node(config, parent, root) {
  Base.call(this, config || {});
  this.define('parent', parent);
  this.define('root', root);
}

/**
 * Expose `Node`
 */

Base.extend(Node);
utils.Node = Node;

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
