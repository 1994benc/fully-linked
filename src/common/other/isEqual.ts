import * as equal from 'fast-deep-equal'
export function areObjectsEqual<T>(lhs: any, rhs: any): boolean {
    return equal(lhs, rhs)
}