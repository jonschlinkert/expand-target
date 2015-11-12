# Valid target patterns

## files-object mappings

> expands "files-objects" into src-dest mappings

```js
target({
  'foo/': 'test/fixtures/*.txt',
  'bar/': 'test/fixtures/*.txt'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: [
        'test/fixtures/a.txt',
        'test/fixtures/b.txt',
        'test/fixtures/c.txt',
        'test/fixtures/d.txt'
      ],
      dest: 'foo/'
    },
    {
      options: {},
      src: [
        'test/fixtures/a.txt',
        'test/fixtures/b.txt',
        'test/fixtures/c.txt',
        'test/fixtures/d.txt'
      ],
      dest: 'bar/'
    }
  ]
}
```

and...


```js
target({
  options: {
    mapDest: true
  },
  'foo/': 'test/fixtures/*.txt',
  'bar/': 'test/fixtures/*.txt'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'foo/test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'foo/test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'foo/test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'foo/test/fixtures/d.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'bar/test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'bar/test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'bar/test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'bar/test/fixtures/d.txt'
    }
  ]
}
```

## `src` normalization

> attempts to create a node when no `src` exists

```js
target({
  foo: 'bar'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['bar'],
      dest: 'foo'
    }
  ]
}
```

> arrayifies the `src` property

```js
target({
  src: 'a',
  dest: 'b'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['a'],
      dest: 'b'
    }
  ]
}
```

> expands `src` glob patterns:

```js
target({
  src: 'test/fixtures/*.txt'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: [
        'test/fixtures/a.txt',
        'test/fixtures/b.txt',
        'test/fixtures/c.txt',
        'test/fixtures/d.txt'
      ],
      dest: ''
    }
  ]
}
```

> expands `src` glob patterns with `dest`:

```js
target({
  src: 'test/fixtures/*.txt',
  dest: 'dist/'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: [
        'test/fixtures/a.txt',
        'test/fixtures/b.txt',
        'test/fixtures/c.txt',
        'test/fixtures/d.txt'
      ],
      dest: 'dist/'
    }
  ]
}
```

> expands `src` glob patterns with `dest` and `cwd`:

```js
target({
  options: {
    cwd: 'test/fixtures',
    mapDest: true
  },
  src: '*.txt',
  dest: 'dist/'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/a.txt'],
      dest: 'dist/a.txt'
    },
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/b.txt'],
      dest: 'dist/b.txt'
    },
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/c.txt'],
      dest: 'dist/c.txt'
    },
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/d.txt'],
      dest: 'dist/d.txt'
    }
  ]
}
```

> uses a `cwd` to expand `src` glob patterns:

```js
target({
  src: '*.txt',
  options: {
    cwd: 'test/fixtures'
  }
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: [
        'a.txt',
        'b.txt',
        'c.txt',
        'd.txt'
      ],
      dest: ''
    }
  ]
}
```

## options.expand

> joins the `cwd` to expanded `src` paths:

```js
target({
  src: '*.txt',
  options: {
    cwd: 'test/fixtures',
    mapDest: true
  }
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/a.txt'],
      dest: 'a.txt'
    },
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/b.txt'],
      dest: 'b.txt'
    },
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/c.txt'],
      dest: 'c.txt'
    },
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/d.txt'],
      dest: 'd.txt'
    }
  ]
}
```

> expands `src` paths into src-dest mappings:

```js
target({
  src: 'test/fixtures/*.txt',
  options: {
    mapDest: true
  }
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'test/fixtures/d.txt'
    }
  ]
}
```

> creates `dest` properties using the `src` basename:

```js
target({
  options: {
    mapDest: true
  },
  src: 'test/fixtures/*.txt'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'test/fixtures/d.txt'
    }
  ]
}
```

> does not prepend `cwd` to created `dest` mappings:

```js
target({
  options: {
    cwd: 'test/fixtures/',
    mapDest: true
  },
  src: '*.txt'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        cwd: 'test/fixtures/'
      },
      src: ['test/fixtures/a.txt'],
      dest: 'a.txt'
    },
    {
      options: {
        cwd: 'test/fixtures/'
      },
      src: ['test/fixtures/b.txt'],
      dest: 'b.txt'
    },
    {
      options: {
        cwd: 'test/fixtures/'
      },
      src: ['test/fixtures/c.txt'],
      dest: 'c.txt'
    },
    {
      options: {
        cwd: 'test/fixtures/'
      },
      src: ['test/fixtures/d.txt'],
      dest: 'd.txt'
    }
  ]
}
```

> expands `src` paths to src-dest mappings:

```js
target({
  src: '*.txt',
  options: {
    cwd: 'test/fixtures',
    mapDest: true
  }
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/a.txt'],
      dest: 'a.txt'
    },
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/b.txt'],
      dest: 'b.txt'
    },
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/c.txt'],
      dest: 'c.txt'
    },
    {
      options: {
        cwd: 'test/fixtures'
      },
      src: ['test/fixtures/d.txt'],
      dest: 'd.txt'
    }
  ]
}
```

## files objects:

> expands files objects when `src` is a string:

```js
target({
  options: {
    mapDest: true
  },
  'foo/': 'test/fixtures/*.txt',
  'bar/': 'test/fixtures/*.txt'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'foo/test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'foo/test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'foo/test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'foo/test/fixtures/d.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'bar/test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'bar/test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'bar/test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'bar/test/fixtures/d.txt'
    }
  ]
}
```

> expands files objects when `expand` is on options:

```js
target({
  options: {
    mapDest: true
  },
  'foo/': 'test/fixtures/*.txt',
  'bar/': 'test/fixtures/*.txt'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'foo/test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'foo/test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'foo/test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'foo/test/fixtures/d.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'bar/test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'bar/test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'bar/test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'bar/test/fixtures/d.txt'
    }
  ]
}
```

> expands files objects when expand is on the root:

```js
target({
  mapDest: true,
  'foo/': 'test/fixtures/*.txt',
  'bar/': 'test/fixtures/*.txt'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'foo/test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'foo/test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'foo/test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'foo/test/fixtures/d.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'bar/test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'bar/test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'bar/test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'bar/test/fixtures/d.txt'
    }
  ]
}
```

> expands files objects when `src` is an array:

```js
target({
  options: {
    mapDest: true
  },
  'foo/': [
    'test/fixtures/*.txt'
  ],
  'bar/': [
    'test/fixtures/*.txt'
  ]
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'foo/test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'foo/test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'foo/test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'foo/test/fixtures/d.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a.txt'],
      dest: 'bar/test/fixtures/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/b.txt'],
      dest: 'bar/test/fixtures/b.txt'
    },
    {
      options: {},
      src: ['test/fixtures/c.txt'],
      dest: 'bar/test/fixtures/c.txt'
    },
    {
      options: {},
      src: ['test/fixtures/d.txt'],
      dest: 'bar/test/fixtures/d.txt'
    }
  ]
}
```

## options.flatten:

> flattens dest paths:

```js
target({
  options: {
    mapDest: true,
    flatten: true
  },
  src: 'test/fixtures/a/**/*.txt',
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a/a.txt'],
      dest: 'dest/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aa.txt'],
      dest: 'dest/aa.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aaa/aaa.txt'],
      dest: 'dest/aaa.txt'
    }
  ]
}
```

> does not flatten `dest` paths when `flatten` is false

```js
target({
  options: {
    mapDest: true,
    flatten: false
  },
  src: 'test/fixtures/a/**/*.txt',
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a/a.txt'],
      dest: 'dest/test/fixtures/a/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aa.txt'],
      dest: 'dest/test/fixtures/a/aa/aa.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aaa/aaa.txt'],
      dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
    }
  ]
}
```

> does not flatten `dest` paths when `flatten` is undefined:

```js
target({
  options: {
    mapDest: true
  },
  src: 'test/fixtures/a/**/*.txt',
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a/a.txt'],
      dest: 'dest/test/fixtures/a/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aa.txt'],
      dest: 'dest/test/fixtures/a/aa/aa.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aaa/aaa.txt'],
      dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
    }
  ]
}
```

## trailing slashes:

> uses `dest` with or without trailing slash:

```js
target({
  options: {
    mapDest: true
  },
  src: ['test/fixtures/a/**/*.txt'],
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a/a.txt'],
      dest: 'dest/test/fixtures/a/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aa.txt'],
      dest: 'dest/test/fixtures/a/aa/aa.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aaa/aaa.txt'],
      dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
    }
  ]
}
```

and...


```js
target({
  options: {
    mapDest: true
  },
  src: ['test/fixtures/a/**/*.txt'],
  dest: 'dest/'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a/a.txt'],
      dest: 'dest/test/fixtures/a/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aa.txt'],
      dest: 'dest/test/fixtures/a/aa/aa.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aaa/aaa.txt'],
      dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
    }
  ]
}
```

> flattens `dest` paths by joining pre-dest to src filepath:

```js
target({
  options: {
    mapDest: true,
    flatten: true
  },
  src: ['test/fixtures/a/**/*.txt'],
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {},
      src: ['test/fixtures/a/a.txt'],
      dest: 'dest/a.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aa.txt'],
      dest: 'dest/aa.txt'
    },
    {
      options: {},
      src: ['test/fixtures/a/aa/aaa/aaa.txt'],
      dest: 'dest/aaa.txt'
    }
  ]
}
```

## options.ext:

> uses the specified extension on dest files:

```js
target({
  options: {
    mapDest: true,
    ext: '.foo',
    extDot: 'first'
  },
  src: ['test/fixtures/**/foo.*/**'],
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        ext: '.foo'
      },
      src: ['test/fixtures/foo.bar'],
      dest: 'dest/test/fixtures/foo.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'first'
      },
      src: ['test/fixtures/foo.bar/baz.qux'],
      dest: 'dest/test/fixtures/foo.bar/baz.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'first'
      },
      src: ['test/fixtures/foo.bar/baz.qux/fez.faz'],
      dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'first'
      },
      src: ['test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'],
      dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.faz/x.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'first'
      },
      src: ['test/fixtures/foo.bar/baz.qux/foo'],
      dest: 'dest/test/fixtures/foo.bar/baz.qux/foo.foo'
    }
  ]
}
```

> uses extension when it is an empty string:

```js
target({
  options: {
    mapDest: true,
    ext: '.',
    extDot: 'first'
  },
  src: ['test/fixtures/a/**/*.txt'],
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        ext: ''
      },
      src: ['test/fixtures/a/a.txt'],
      dest: 'dest/test/fixtures/a/a'
    },
    {
      options: {
        ext: '.',
        extDot: 'first'
      },
      src: ['test/fixtures/a/aa/aa.txt'],
      dest: 'dest/test/fixtures/a/aa/aa'
    },
    {
      options: {
        ext: '.',
        extDot: 'first'
      },
      src: ['test/fixtures/a/aa/aaa/aaa.txt'],
      dest: 'dest/test/fixtures/a/aa/aaa/aaa'
    }
  ]
}
```

## options.extDot:

> when `extDot` is `first`, everything after the first dot in the filename is replaced:

```js
target({
  options: {
    mapDest: true,
    ext: '.foo',
    extDot: 'first'
  },
  src: ['test/fixtures/foo.*/**'],
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        ext: '.foo',
        extDot: 'first'
      },
      src: ['test/fixtures/foo.bar'],
      dest: 'dest/test/fixtures/foo.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'first'
      },
      src: ['test/fixtures/foo.bar/baz.qux'],
      dest: 'dest/test/fixtures/foo.bar/baz.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'first'
      },
      src: ['test/fixtures/foo.bar/baz.qux/fez.faz'],
      dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'first'
      },
      src: ['test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'],
      dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.faz/x.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'first'
      },
      src: ['test/fixtures/foo.bar/baz.qux/foo'],
      dest: 'dest/test/fixtures/foo.bar/baz.qux/foo.foo'
    }
  ]
}
```

> when `extDot` is `last`, everything after the last dot in the filename is replaced:

```js
target({
  options: {
    mapDest: true,
    ext: '.foo',
    extDot: 'last'
  },
  src: ['test/fixtures/foo.*/**'],
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        ext: '.foo',
        extDot: 'last'
      },
      src: ['test/fixtures/foo.bar'],
      dest: 'dest/test/fixtures/foo.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'last'
      },
      src: ['test/fixtures/foo.bar/baz.qux'],
      dest: 'dest/test/fixtures/foo.bar/baz.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'last'
      },
      src: ['test/fixtures/foo.bar/baz.qux/fez.faz'],
      dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'last'
      },
      src: ['test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'],
      dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.faz/x.y.foo'
    },
    {
      options: {
        ext: '.foo',
        extDot: 'last'
      },
      src: ['test/fixtures/foo.bar/baz.qux/foo'],
      dest: 'dest/test/fixtures/foo.bar/baz.qux/foo.foo'
    }
  ]
}
```

## options.cwd:

> when `cwd` is defined, the cwd is stripped from the filepath before joining to dest:

```js
target({
  options: {
    mapDest: true,
    cwd: 'a'
  },
  src: ['test/fixtures/**/*.txt'],
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        mapDest: true,
        cwd: 'a'
      },
      src: [],
      dest: 'dest'
    }
  ]
}
```

## options.rename:

> supports custom rename function:

```js
target({
  options: {
    mapDest: true,
    flatten: true,
    cwd: 'a',
    rename: function (dest, fp, options) {
      return path.join(dest, options.cwd, 'foo', fp);
    }
  },
  src: ['test/fixtures/**/*.txt'],
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        mapDest: true,
        flatten: true,
        cwd: 'a',
        rename: function (dest, fp, options) {
          return path.join(dest, options.cwd, 'foo', fp);
        }
      },
      src: [],
      dest: 'dest'
    }
  ]
}
```

> exposes target properties as `this` to the rename function:

```js
target({
  options: {
    mapDest: true,
    permalink: ':dest/:upper(basename)',
    filter: function (fp) {
      return fs.statSync(fp).isFile();
    },
    upper: function (str) {
      return str.toUpperCase();
    },
    rename: function (dest, fp, options) {
          var pattern = options.permalink;
          var ctx = merge({}, this, options, {
            dest: path.dirname(dest)
          });
          ctx.basename = path.basename(fp);
          ctx.ext = ctx.extname;
          var fn = expand({
            regex: /:([(\w ),]+)/
          });
          return fn(pattern, ctx);
        }
  },
  src: ['test/fixtures/**/*'],
  dest: 'foo/bar'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/a.txt'],
      dest: 'foo/bar/test/fixtures/A.TXT'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/a/a.txt'],
      dest: 'foo/bar/test/fixtures/a/A.TXT'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/a/aa/aa.txt'],
      dest: 'foo/bar/test/fixtures/a/aa/AA.TXT'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/a/aa/aaa/aaa.txt'],
      dest: 'foo/bar/test/fixtures/a/aa/aaa/AAA.TXT'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/b.txt'],
      dest: 'foo/bar/test/fixtures/B.TXT'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/b/alpha.js'],
      dest: 'foo/bar/test/fixtures/b/ALPHA.JS'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/b/beta.js'],
      dest: 'foo/bar/test/fixtures/b/BETA.JS'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/b/gamma.js'],
      dest: 'foo/bar/test/fixtures/b/GAMMA.JS'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/c.txt'],
      dest: 'foo/bar/test/fixtures/C.TXT'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/c/apple.coffee'],
      dest: 'foo/bar/test/fixtures/c/APPLE.COFFEE'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/c/celery.coffee'],
      dest: 'foo/bar/test/fixtures/c/CELERY.COFFEE'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/c/walnut.coffee'],
      dest: 'foo/bar/test/fixtures/c/WALNUT.COFFEE'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/d.txt'],
      dest: 'foo/bar/test/fixtures/D.TXT'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'],
      dest: 'foo/bar/test/fixtures/foo.bar/baz.qux/fez.faz/X.Y.Z'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/foo.bar/baz.qux/foo'],
      dest: 'foo/bar/test/fixtures/foo.bar/baz.qux/FOO'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/one.md'],
      dest: 'foo/bar/test/fixtures/ONE.MD'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/three.md'],
      dest: 'foo/bar/test/fixtures/THREE.MD'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/two.md'],
      dest: 'foo/bar/test/fixtures/TWO.MD'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/x.js'],
      dest: 'foo/bar/test/fixtures/X.JS'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/y.js'],
      dest: 'foo/bar/test/fixtures/Y.JS'
    },
    {
      options: {
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        }
      },
      src: ['test/fixtures/z.js'],
      dest: 'foo/bar/test/fixtures/Z.JS'
    }
  ]
}
```

> expanded `src` arrays are grouped by dest paths:

```js
target({
  options: {
    mapDest: true,
    flatten: true,
    cwd: '',
    rename: function (dest, fp) {
      return path.join(dest, 'all' + path.extname(fp));
    }
  },
  src: ['test/fixtures/{a,b}/**/*'],
  dest: 'dest'
});
```

**results in**

```js
{
  options: {},
  files: [
    {
      options: {
        cwd: ''
      },
      src: ['test/fixtures/a/a.txt'],
      dest: 'dest/a.txt/all.txt'
    },
    {
      options: {
        cwd: ''
      },
      src: ['test/fixtures/a/aa'],
      dest: 'dest/aa/all'
    },
    {
      options: {
        cwd: ''
      },
      src: ['test/fixtures/a/aa/aa.txt'],
      dest: 'dest/aa.txt/all.txt'
    },
    {
      options: {
        cwd: ''
      },
      src: ['test/fixtures/a/aa/aaa'],
      dest: 'dest/aaa/all'
    },
    {
      options: {
        cwd: ''
      },
      src: ['test/fixtures/a/aa/aaa/aaa.txt'],
      dest: 'dest/aaa.txt/all.txt'
    },
    {
      options: {
        cwd: ''
      },
      src: ['test/fixtures/b/alpha.js'],
      dest: 'dest/alpha.js/all.js'
    },
    {
      options: {
        cwd: ''
      },
      src: ['test/fixtures/b/beta.js'],
      dest: 'dest/beta.js/all.js'
    },
    {
      options: {
        cwd: ''
      },
      src: ['test/fixtures/b/gamma.js'],
      dest: 'dest/gamma.js/all.js'
    }
  ]
}
```
