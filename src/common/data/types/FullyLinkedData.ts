import { Edge } from "../../item/edge/types/Edge";
import { ProcessedNode, Node } from "../../item/node/types/Node";

export interface FullyLinkedData<NodeType, EdgeType, GlobalNodePropsType> {
  id: string;
  nodes: Node<NodeType, GlobalNodePropsType>[];
  edges: Edge<EdgeType>[];
}

export interface InternalFullyLinkedData<NodeType, EdgeType, GlobalNodePropsType> extends FullyLinkedData<NodeType, EdgeType, GlobalNodePropsType> {
  nodes: ProcessedNode<NodeType, GlobalNodePropsType>[];
}