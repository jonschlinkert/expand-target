

function format(val) {
  return JSON.stringify(val);
}

function validate(val) {
  if (!isObject(val)) {
    throw new TypeError('expected an object: ' + format(val));
  }

  if (!hasFiles(val)) {
    throw new TypeError('expected files to be an array:' + format(val));
  }

  val.files.forEach(function (file) {
    if (file.src && !isArray(file.src)) {
      throw new TypeError('expected src to be an array in: ' + format(file));
    }
  })

  if (!hasOptions(val)) {
    throw new TypeError('expected options to be an object:' + format(val));
  }
}


function hasFiles(val) {
  return isArray(val.files);
}

function hasOptions(val) {
  return isObject(val.options);
}

function isArray(val) {
  return Array.isArray(val);
}

function isObject(val) {
  return val && !isArray(val)
    && typeof val === 'object';
}

module.exports = validate;
