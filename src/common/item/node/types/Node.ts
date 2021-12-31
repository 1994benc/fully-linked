import { ReactElement } from "react";
export interface Node<T> {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: T;
  /**
   * A function that returns an HTMLElement representing a node.
   * If this is not defined, a default node element will be created.
   */
  customNodeElement?: (node: InternalNode<T>) => HTMLElement;
  /** A function that returns a react component representing a node.
   *  This will override the default node element and customNodeElement
   */
  customNodeElementAsReactComponent?: (node: InternalNode<T>) => ReactElement;
  selector?: string;
}

export interface InternalNode<T> extends Node<T> {
  startAnchorPoint?: { x: number; y: number };
  endAnchorPoint?: { x: number; y: number };
}
