import { areObjectsEqual } from "./isEqual";

describe("isEqual", () => {
  test("1 !== 2", () => {
    expect(areObjectsEqual(1, 2)).toBe(false);
  });

  test("null === null", () => {
    expect(areObjectsEqual(null, null)).toBe(true);
  });

  test("null !== 2", () => {
    expect(areObjectsEqual(null, 2)).toBe(false);
  });

  test("undefined === undefined", () => {
    expect(areObjectsEqual(undefined, undefined)).toBe(true);
  });

  test("undefined !== 2", () => {
    expect(areObjectsEqual(undefined, 2)).toBe(false);
  });

  test("{a:3} === {a:3}", () => {
    expect(areObjectsEqual({ a: 3 }, { a: 3 })).toBe(true);
  });

  test("{a:4} !== {a:3}", () => {
    expect(areObjectsEqual({ a: 4 }, { a: 3 })).toBe(false);
  });

  test("{a:[3,3]} === {a:[3,3]}", () => {
    expect(areObjectsEqual({ a: [3, 3] }, { a: [3, 3] })).toBe(true);
  });

  test("{a:[3,4]} !== {a:[3,3]}", () => {
    expect(areObjectsEqual({ a: [3, 4] }, { a: [3, 3] })).toBe(false);
  });

  test("{a:[3,{'name':'ben'}]} === {a:[3,{'name':'ben'}]}", () => {
    expect(
      areObjectsEqual({ a: [3, { name: "ben" }] }, { a: [3, { name: "ben" }] })
    ).toBe(true);
  });

  test("{a:[3,{'name':'ben'}]} !== {a:[3,{'name':'besn'}]}", () => {
    expect(
      areObjectsEqual({ a: [3, { name: "ben" }] }, { a: [3, { name: "besn" }] })
    ).toBe(false);
  });
  test("{ a: [3, { name: {name: 'ben'} }] } !== { a: [3, { name: {name: 'besn'} }] }", () => {
    expect(
      areObjectsEqual(
        { a: [3, { name: { name: "ben" } }] },
        { a: [3, { name: { name: "besn" } }] }
      )
    ).toBe(false);
  });

  test("{ a: [3, { name: {name: 'ben'} }] } === { a: [3, { name: {name: 'ben'} }] }", () => {
    expect(
      areObjectsEqual(
        { a: [3, { name: { name: "ben" } }] },
        { a: [3, { name: { name: "ben" } }] }
      )
    ).toBe(true);
  });
});
