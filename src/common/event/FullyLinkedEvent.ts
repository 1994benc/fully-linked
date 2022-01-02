import { Edge } from "../item/Edge/types/Edge";
import { Node, ProcessedNode } from "../item/Node/types/Node";

export interface FullyLinkedEvent<NodeType, EdgeType, SpecificFullyLinkedEventInfo, GlobalNodePropsType> {
  item: ProcessedNode<NodeType, GlobalNodePropsType> | Node<NodeType, GlobalNodePropsType> | Edge<EdgeType> | null;
  itemType: "node" | "edge" | null;
  info: SpecificFullyLinkedEventInfo;
}
