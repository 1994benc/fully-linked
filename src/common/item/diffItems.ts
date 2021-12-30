import { areObjectsEqual } from "../other/isEqual";

export function diffItems<T extends { data: any; id: string }>(
  existing: T[],
  newData: T[]
): {
  added: T[];
  removed: T[];
  updated: T[];
} {
  console.log(areObjectsEqual(2,3), false)
  console.log(areObjectsEqual({a:3},{a:3}), true)
  console.log(areObjectsEqual({a:4},{a:3}), false)
  console.log(areObjectsEqual({a:[3,3]},{a:[3,3]}), true)
  console.log(areObjectsEqual({a:[3,4]},{a:[3,3]}), false)
  console.log(areObjectsEqual({a:[3,{'name':"ben"}]},{a:[3,{'name':"ben"}]}), true)
  console.log(areObjectsEqual({a:[3,{'name':"ben"}]},{a:[3,{'name':"besn"}]}), false)


  const added: T[] = [];
  const removed: T[] = [];
  const updated: T[] = [];
  for (const newNode of newData) {
    const existingNode = existing.find((node) => node.id === newNode.id);
    if (!existingNode) {
      added.push(newNode);
    }
  }
  for (const existingNode of existing) {
    const newNode = newData.find((node) => node.id === existingNode.id);
    if (!newNode) {
      removed.push(existingNode);
    }
  }


  for (const existingNode of existing) {
    const newNode = newData.find((node) => node.id === existingNode.id);
    if (newNode) {
      if (!areObjectsEqual(existingNode.data, newNode.data)) {
        updated.push(newNode);
      }
    }
  }

  return { added, removed, updated };
}
