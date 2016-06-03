'use strict';

require('mocha');
require('should');
var assert = require('assert');
var Target = require('..');
var target;

describe('Target', function() {
  it('should create an instance of Target', function() {
    target = new Target({src: '*'});
    assert(target instanceof Target);
  });

  it('should instantiate without "new"', function() {
    target = Target({src: '*'});
    assert(target instanceof Target);
  });
});
