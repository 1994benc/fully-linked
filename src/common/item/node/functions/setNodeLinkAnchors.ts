import { ProcessedNode } from "../types/Node";

export function setNodeLinkAnchors<NodeType, GlobalNodePropsType>(node: ProcessedNode<NodeType, GlobalNodePropsType>) {
  node.startAnchorPoint = {
    x: node.x,
    y: node.y + node.height / 2,
  };
  node.endAnchorPoint = {
    x: node.x + node.width,
    y: node.y + node.height / 2,
  };
}
