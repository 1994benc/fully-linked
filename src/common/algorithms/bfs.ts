import { FullyLinked } from "../..";
import { Node } from "../item/node/types/Node";

export async function bfs<NodeType, EdgeType, NodeGlobalProps>(
  node: Node<NodeType, NodeGlobalProps>,
  graph: FullyLinked<NodeType, EdgeType, NodeGlobalProps>,
  onNodeVisit?: (
    node: Node<NodeType, NodeGlobalProps>,
    nodeElement: HTMLElement
  ) => void,
  afterNodeVisitDelay?: (
    node: Node<NodeType, NodeGlobalProps>,
    nodeElement: HTMLElement
  ) => void,
  waitDurationAfterNodeVisit: number = 0
) {
  const queue = [node];
  while (queue.length > 0) {
    const current = queue.shift();
    if (current) {
      const elem = graph
        .getNodeElement(current.id)
        ?.children.item(0) as HTMLElement;
      onNodeVisit?.(current, elem);
      await sleep(waitDurationAfterNodeVisit);
      afterNodeVisitDelay?.(current, elem);

      const edges = graph.getAllEdges()?.filter((edge) => {
        return edge.source === current.id;
      });

      const children = edges?.map((edge) => {
        return graph.getAllNodes()?.find((n) => n.id === edge.target);
      });

      if (children) {
        for (const child of children) {
          if (child) {
            queue.push(child);
          }
        }
      }
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
