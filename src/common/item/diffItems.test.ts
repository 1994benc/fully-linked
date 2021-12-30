import { diffItems } from "./diffItems";

describe("diffItems", () => {
  test("two arrays are equal", () => {
    const { added, removed, updated } = diffItems<{ id: string; data: any }>(
      [
        { id: "1", data: { a: 1 } },
        { id: "2", data: { a: 2 } },
      ],
      [
        { id: "1", data: { a: 1 } },
        { id: "2", data: { a: 2 } },
      ]
    );

    expect(added).toEqual([]);
    expect(removed).toEqual([]);
    expect(updated).toEqual([]);
  });

  test("an array item has been updated", () => {
    const { added, removed, updated } = diffItems<{ id: string; data: any }>(
      [
        { id: "1", data: { a: 1 } },
        { id: "2", data: { a: 2 } },
      ],
      [
        { id: "1", data: { a: 1 } },
        { id: "2", data: { a: 3 } },
      ]
    );

    expect(added).toEqual([]);
    expect(removed).toEqual([]);
    expect(updated).toEqual([{ id: "2", data: { a: 3 } }]);
  });

  test("a new item has been added and an item has been updated", () => {
    const { added, removed, updated } = diffItems<{ id: string; data: any }>(
      [
        { id: "1", data: { a: 1 } },
        { id: "2", data: { a: 2 } },
      ],
      [
        { id: "1", data: { a: 1 } },
        { id: "2", data: { a: 3 } },
        { id: "3", data: { a: 4 } },
      ]
    );

    expect(added).toEqual([{ id: "3", data: { a: 4 } }]);
    expect(removed).toEqual([]);
    expect(updated).toEqual([{ id: "2", data: { a: 3 } }]);
  });

  test("a new item added, an item updated, and an item removed", () => {
    const { added, removed, updated } = diffItems<{ id: string; data: any }>(
      [
        { id: "1", data: { a: 1 } },
        { id: "2", data: { a: 2 } },
      ],
      [
        { id: "2", data: { a: 3 } },
        { id: "3", data: { a: 4 } },
      ]
    );

    expect(added).toEqual([{ id: "3", data: { a: 4 } }]);
    expect(removed).toEqual([{ id: "1", data: { a: 1 } }]);
    expect(updated).toEqual([{ id: "2", data: { a: 3 } }]);
  });
});
