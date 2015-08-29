'use strict';

var Base = require('app-base');

function Node(config, parent) {
  Base.call(this, config);

  if (parent) {
    this.define('parent', {
      enumerable: false,
      get: function () {
        return parent;
      }
    });
  }

  this.define('root', {
    enumerable: false,
    get: function () {
      var root;
      if (this.parent) {
        root = this.parent.root || this.parent.orig;
      }
      return root || this.orig || this;
    }
  });
}

Base.extend(Node);

/**
 * Expose `Node`
 */

module.exports = Node;
