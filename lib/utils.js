'use strict';

var pick = require('object.pick');
var Id = require('id-gen');
var id = new Id();

id.create('target');
id.create('task', {prefix: 'task'});

/**
 * Expose `utils`
 */

var utils = module.exports;

/**
 * Expose `id`
 */

utils.id = id;

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
