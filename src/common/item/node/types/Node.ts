export interface Node<T> {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: T;
  customNodeElement?: (node: InternalNode<T>) => HTMLElement;
  selector?: string;
}

export interface InternalNode<T> extends Node<T> {
  startAnchorPoint?: { x: number; y: number };
  endAnchorPoint?: { x: number; y: number };
}
