import { Edge } from "./Edge";
import { InternalNode, Node } from "./Node";

export interface FullyLinkedData<NodeType, EdgeType> {
  id: string;
  nodes: Node<NodeType>[];
  edges: Edge<EdgeType>[];
}

export interface InternalFullyLinkedData<NodeType, EdgeType> extends FullyLinkedData<NodeType, EdgeType> {
  nodes: InternalNode<NodeType>[];
}