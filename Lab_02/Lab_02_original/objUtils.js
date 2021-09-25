
/**
 * Check if a parameter is undefined
 * @param {*} a Parameter to verify
 */
function verifyNotUndefined(a) {
  if (a === undefined) throw Error('Empty, undefined, missing input given');
}

/**
 * Check if a parameter is null
 * @param {*} a Parameter to verify
 */
function verifyNotNull(a) {
  if (a === null) throw Error('Parameter was undefined/empty');
}

/**
 * Verify if a parameter is an object
 * @param {*} a Parameter to verify
 * @param {string} t Type to check against
 */
function verifyType(a, t = 'object') {
  if (typeof(a) != t) throw Error(`Expected a/an ${t}, received a/an ${typeof(a)}. Please fix input.`);
}

/**
 * first method in assignment for this file
 * @param {[Object]} arr Array of objects
 * @param {function} f The function to run on each element
 * @return {Object}
 */
function computeObjects(arr, f) {
  verifyNotUndefined(arr);
  verifyNotUndefined(f);
  verifyNotNull(arr);
  verifyType(arr, 'object');
  const ret = {};
  arr.forEach((obj) => {
    verifyType(obj);
    for (const [k, v] of Object.entries(obj)) {
      if (k in ret) {
        ret[k] += f(v);
      } else {
        ret[k] = f(v);
      }
    }
  });
  return ret;
};

/**
 * Process objects per the assignment
 * @param {object} o1 obj1
 * @param {object} o2 obj2
 * @return {object}
 */
function commonKeys(o1, o2) {
  verifyNotUndefined(o1); verifyNotUndefined(o2);
  verifyType(o1); verifyType(o2);
  verifyNotNull(o1); verifyNotNull(o2);
  const ret = {};
  for (const [k, v] of Object.entries(o1)) {
    if (k in o2) {
      if (typeof(v) === 'object' && typeof(o2[k] === 'object')) {
        const newV = commonKeys(v, o2[k]);
        ret[k] = newV;
      }
      if (o2[k] === v) {
        ret[k] = v;
      }
    }
  }
  return ret;
}
/**
 *
 * @param {object} o the object
 * @return {object}
 */
function flipObject(o) {
  verifyNotUndefined(o);
  verifyType(o);
  const ret = {};
  for (const [k, v] of Object.entries( o)) {
    if (v === null) throw Error('Null values not allowed');
    if (typeof(v) === 'object') {
      ret[k] = flipObject(v);
    } else {
      verifyType(v, 'number');
      ret[v] = k;
    }
  }
  return ret;
}

module.exports = {computeObjects, commonKeys, flipObject};
