import * as equal from 'fast-deep-equal/es6'
export function areObjectsEqual<T>(lhs: any, rhs: any): boolean {
    return equal(lhs, rhs)
}