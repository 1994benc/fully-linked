export function areObjectsEqual<T>(lhs: any, rhs: any): boolean {
  // Inspired by https://www.npmjs.com/package/fast-deep-equal
  if (lhs === rhs) {
    return true;
  }

  if (lhs && rhs && typeof lhs == "object" && typeof rhs == "object") {
    if (lhs.constructor !== rhs.constructor) return false;

    let length, i, keys;
    if (Array.isArray(lhs)) {
      length = lhs.length;
      if (length != rhs.length) return false;
      for (i = length; i-- !== 0; )
        if (!areObjectsEqual(lhs[i], rhs[i])) return false;
      return true;
    }

    if (lhs.constructor === RegExp)
      return lhs.source === rhs.source && lhs.flags === rhs.flags;
    if (lhs.valueOf !== Object.prototype.valueOf)
      return lhs.valueOf() === rhs.valueOf();
    if (lhs.toString !== Object.prototype.toString)
      return lhs.toString() === rhs.toString();

    keys = Object.keys(lhs);
    length = keys.length;
    if (length !== Object.keys(rhs).length) return false;

    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(rhs, keys[i])) return false;

    for (i = length; i-- !== 0; ) {
      let key = keys[i];

      if (!areObjectsEqual(lhs[key], rhs[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return lhs !== lhs && rhs !== rhs;
}
