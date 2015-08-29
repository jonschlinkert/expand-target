# expand-target [![NPM version](https://badge.fury.io/js/expand-target.svg)](http://badge.fury.io/js/expand-target)

> Expand target definitions in a declarative configuration.

## Table of contents

<!-- toc -->

* [Install](#install)
* [Usage](#usage)
* [Options](#options)
  - [options properties](#options-properties)
* [Related projects](#related-projects)
* [Running tests](#running-tests)
* [Contributing](#contributing)
* [Author](#author)
* [License](#license)

_(Table of contents generated by [verb](https://github.com/verbose/verb))_

<!-- tocstop -->

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i expand-target --save
```

## Usage

```js
var target = require('expand-target');
```

Write declarative "target" definitions similar in concept to those used by [grunt](http://gruntjs.com/) and [make](http://www.gnu.org/software/make/manual/html_node/Standard-Targets.html).

**Basic example**

```js
target({
  files: {
    'a/': ['*.js'],
    'b/': ['*.js'],
    'c/': ['*.js']
  }
});
```

**results in**

```js
{
  files: [
    {
      src: ['examples.js', 'index.js'],
      dest: 'a/'
    },
    {
      src: ['examples.js', 'index.js'],
      dest: 'b/'
    },
    {
      src: ['examples.js', 'index.js'],
      dest: 'c/'
    }
  ]
}
```

> the same example with `expand: true` defined on the options

```js
target({
  options: { expand: true },
  files: {
    'a/': ['*.js'],
    'b/': ['*.js'],
    'c/': ['*.js']
  }
});
```

**results in**

```js
{
  options: {
    expand: true
  },
  files: [
    {
      src: ['examples.js'],
      dest: 'a/examples.js'
    },
    {
      src: ['index.js'],
      dest: 'a/index.js'
    },
    {
      src: ['examples.js'],
      dest: 'b/examples.js'
    },
    {
      src: ['index.js'],
      dest: 'b/index.js'
    },
    {
      src: ['examples.js'],
      dest: 'c/examples.js'
    },
    {
      src: ['index.js'],
      dest: 'c/index.js'
    }
  ]
}
```

See [more examples](./examples.md). Visit [expand-files](https://github.com/jonschlinkert/expand-files) for the full range of options and documentation.

## Options

Any option from [expand-files](https://github.com/jonschlinkert/expand-files) may be used. Please see that project for the full range of options and documentation.

### options properties

The below "special" properties are fine to use either on an `options` object or on the root of the object passed to `expand-files`.

Either way they will be normalized onto the `options` object to ensure that [globby][] and consuming libraries are passed the correct arguments.

**special properties**

* `base`
* `cwd`
* `destBase`
* `expand`
* `ext`
* `extDot`
* `extend`
* `flatten`
* `rename`
* `process`
* `srcBase`

**example**

Both of the following will result in `expand` being on the `options` object.

```js
files({src: '*.js', dest: 'dist/', options: {expand: true}});
files({src: '*.js', dest: 'dist/', expand: true});
```

## Related projects

* [expand-config](https://www.npmjs.com/package/expand-config): Expand tasks, targets and options in a declarative configuraiton. | [homepage](https://github.com/jonschlinkert/expand-config)
* [expand-files](https://www.npmjs.com/package/expand-files): Expand glob patterns in a declarative configuration into src-dest mappings. | [homepage](https://github.com/jonschlinkert/expand-files)
* [expand-task](https://www.npmjs.com/package/expand-task): Expand task definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-task)
* [files-objects](https://www.npmjs.com/package/files-objects): Expand files objects into src-dest mappings. | [homepage](https://github.com/jonschlinkert/files-objects)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/expand-target/issues/new).

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on August 29, 2015._
