import * as react from "react";
export interface Node<DataType, GlobalPropsType> {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: DataType;
  /**
   * A function that returns an HTMLElement representing a node.
   * If this is not defined, a default node element will be created.
   */
  customNodeElement?: (
    node: ProcessedNode<DataType, GlobalPropsType>
  ) => HTMLElement;
  /** A function that returns a react component representing a node.
   *  This will override the default node element and customNodeElement
   */
  customNodeElementAsReactComponent?: (
    node: ProcessedNode<DataType, GlobalPropsType>
  ) => react.ReactElement;
}

/** ProcessedNode is a node that has been processed by FullyLinked so it is populated by various calculated properties */
export interface ProcessedNode<NodeDataType, GlobalNodePropsType> extends Node<NodeDataType, GlobalNodePropsType> {
  startAnchorPoint?: { x: number; y: number };
  endAnchorPoint?: { x: number; y: number };
  isRoot?: boolean;

  /** This is the `globalNodeProps` property in the FullyLinkedOptions (if specified) */
  props?: GlobalNodePropsType;
}
