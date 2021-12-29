import { InternalNode } from "../types/Node";

export function setNodeLinkAnchors<NodeType>(node: InternalNode<NodeType>) {
  node.startAnchorPoint = {
    x: node.x,
    y: node.y + node.height / 2,
  };
  node.endAnchorPoint = {
    x: node.x + node.width,
    y: node.y + node.height / 2,
  };
}
