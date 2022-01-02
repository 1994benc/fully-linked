import { Edge } from "../../item/edge/types/Edge";
import { ProcessedNode, Node } from "../../item/node/types/Node";

export interface FullyLinkedData<NodeType, EdgeType> {
  id: string;
  nodes: Node<NodeType>[];
  edges: Edge<EdgeType>[];
}

export interface InternalFullyLinkedData<NodeType, EdgeType, GlobalNodePropsType> extends FullyLinkedData<NodeType, EdgeType> {
  nodes: ProcessedNode<NodeType, GlobalNodePropsType>[];
}