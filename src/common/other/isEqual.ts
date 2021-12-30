
var deepEqual = require('deep-equal')

export function areObjectsEqual<T>(lhs: any, rhs: any): boolean {
    return deepEqual(lhs, rhs)
}