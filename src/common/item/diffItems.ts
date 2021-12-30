import { isEqual } from "lodash";

export function diffItems<T extends { data: any; id: string }>(
  existing: T[],
  newData: T[]
): {
  added: T[];
  removed: T[];
  updated: T[];
} {
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
      if (!isEqual(existingNode.data, newNode.data)) {
        updated.push(newNode);
      }
    }
  }

  return { added, removed, updated };
}
