var repeat = require('repeat-string');
var forIn = require('for-in');
var extend = require('extend-shallow');
var inspect = require('stringify-object');
var configs = require('./configs');
var Target = require('../');

function stringify(config) {
  return inspect(config, {
    singleQuotes: true,
    indent: '  '
  });
}

function fixIndent(str) {
  str = indentArray(str);

  var lines = str.split('\n');
  var len = lines.length, i = -1;

  while (++i < len) {
    var prev = lines[i - 1];
    var line = lines[i];
    var next = lines[i + 1];

    if (isBody(line, prev)) {
      var lineIndent = indentAmount(line);
      var prevIndent = indentAmount(prev);
      lines[i] = repeat(' ', prevIndent + 2) + line.trim();
      if (/^\s+}/.test(next)) {
        lines[i + 1] = repeat(' ', prevIndent) + next.trim();
      }
    }
  }
  return lines.join('\n');
}

function isBody(curr, prev) {
  return /^\s*return/.test(curr) && /\{\s*$/.test(prev);
}

function indentAmount(str) {
  var m = str.match(/^(\s+)/);
  return m ? m[1].length : 0;
}

function indentArray(str, n) {
  var re = /src: \[[\s\n]+'([^\n\]]+)'[\n\s]+\]/g;
  var m;
  while (m = re.exec(str)) {
    str = str.split(m[0]).join('src: [\'' + m[1] + '\']');
  }
  return str;
}

function section(str) {
  return '## ' + str;
}

function description(str) {
  return '> ' + str;
}

function format(arr) {
  var res = '# Valid target patterns\n\n';
  arr.forEach(function (config) {
    forIn(config, function (val, key) {
      if (key === 'section') {
        res += section(val);
      } else if (key === 'examples') {
        res += examples(val);
      }
      res += '\n';
    });
  });
  return res;
}

function examples(arr) {
  var res = '';

  arr.forEach(function (config) {
    res += '\n';

    forIn(config, function (val, key) {
      if (key === 'description') {
        res += description(val);

      } else if (key === 'config') {
        res += fixIndent(formatEach(val));
      }
    });
  });
  return res;
}

function toMarkdown(config) {
  var orig = extend({}, config);
  var target = new Target();
  target.expand(config);

  var res = '';
  res += '\n';
  res += '\n';
  res += '```js';
  res += '\n';
  res += 'target('+ stringify(orig) + ');';
  res += '\n';
  res += '```';
  res += '\n';
  res += '\n';
  res += '**results in**';
  res += '\n';
  res += '\n';
  res += '```js';
  res += '\n';
  res += stringify(target);
  res += '\n';
  res += '```';
  res += '\n';
  return res;
}

function formatEach(configs) {
  configs = Array.isArray(configs) ? configs : [configs];
  var res = [];
  configs.forEach(function (config) {
    res.push(toMarkdown(config));
  });
  return res.join('\nand...\n');
}

var res = format(configs);
console.log(res.trim());

module.exports = function (section, description, config) {
  return format([{
    section: section,
    examples: [{
      description: description,
      config: [config]
    }]
  }]);
};
