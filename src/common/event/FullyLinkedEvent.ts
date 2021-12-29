import { Edge } from "../item/Edge/types/Edge";
import { Node } from "../item/Node/types/Node";

export interface FullyLinkedEvent<NodeType, EdgeType, SpecificFullyLinkedEventInfo> {
  item: Node<NodeType> | Edge<EdgeType>;
  itemType: "node" | "edge";
  info: SpecificFullyLinkedEventInfo;
}
