import { Disposer } from "../../../disposer/Disposer";
import { FullyLinkedOptions } from "../../../options/FullyLinkedOptions";
import { CanvasZoomAndTransformMaintainer } from "../../canvas/stateMaintainers/CanvasZoomAndTransformMaintainer";
import { CreateNewEdgeStateMaintainer } from "../../edge/stateMaintainers/CreateNewEdgeStateMaintainer";
import { Edge } from "../../edge/types/Edge";
import { createLinkAnchorElement } from "./createLinkAnchorElement";
import { ProcessedNode } from "../types/Node";
import { setupNodeDragging } from "./setupNodeDragging";
import { ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { setNodeLinkAnchors } from "./setNodeLinkAnchors";

export interface CreateSingleNodeParams<NodeType, EdgeType, GlobalNodePropsType> {
  node: ProcessedNode<NodeType, GlobalNodePropsType>;
  innerContainer: HTMLElement;
  container: HTMLElement;
  options: FullyLinkedOptions<GlobalNodePropsType>;
  createNewEdgeStateMaintainer: CreateNewEdgeStateMaintainer;
  canvasZoomLevelMaintainer: CanvasZoomAndTransformMaintainer;
  internalSVGElement: SVGSVGElement;
  edgePlaceholderId: string;
  disposer: Disposer;
  nodeMapById: Map<string, ProcessedNode<NodeType, GlobalNodePropsType>>;
  edgeMapById: Map<string, Edge<EdgeType>>;
  edgeListMapByNodeId: Map<string, Edge<EdgeType>[]>;
  getEdgeListMapByNodeId: () => Map<string, Edge<EdgeType>[]>;
}

export function createSingleNode<NodeType, EdgeType, GlobalNodePropsType>({
  node,
  innerContainer,
  container,
  options,
  createNewEdgeStateMaintainer,
  canvasZoomLevelMaintainer,
  internalSVGElement: svg,
  edgePlaceholderId,
  disposer,
  nodeMapById: nodesMapById,
  edgeMapById: edgesMapById,
  edgeListMapByNodeId: edgesMapByNodeId,
  getEdgeListMapByNodeId
}: CreateSingleNodeParams<NodeType, EdgeType, GlobalNodePropsType>) {
  let nodeElement: HTMLElement | ReactElement;
  let nodeElementWrapper: HTMLElement = document.createElement("div");
  nodeElementWrapper.style.position = "absolute";
  nodeElementWrapper.style.width = node.width + 'px';
  nodeElementWrapper.style.height = node.height + 'px';
  nodeElementWrapper.style.left = `${node.x}px`;
  nodeElementWrapper.style.top = `${node.y}px`;
  nodeElementWrapper.style.transformOrigin = "center";
  nodeElementWrapper.style.cursor = "grab";
  nodeElementWrapper.setAttribute("data-node-id", node.id);
  nodeElementWrapper.classList.add("fully-linked-node-wrapper");

  node.props = options.globalNodeProps;

  if (node.customNodeElementAsReactComponent) {
    nodeElement = node.customNodeElementAsReactComponent(node);
    // TODO: append react element
    ReactDOM.render(nodeElement, nodeElementWrapper);
  }
  else if (node.customNodeElement) {
    nodeElement = node.customNodeElement(node);
    nodeElementWrapper.appendChild(nodeElement as HTMLElement);
  } else {
    nodeElement = document.createElement("div");
    nodeElement.classList.add("fully-linked-node");
    nodeElement.innerText = node.id;
    nodeElementWrapper.appendChild(nodeElement);
  }

  setNodeLinkAnchors(node);
  

  // Create anchor point elements
  const { anchorStartElem, anchorEndElem } = createLinkAnchorElement(
    node,
    svg,
    edgePlaceholderId,
    createNewEdgeStateMaintainer,
    canvasZoomLevelMaintainer,
    disposer,
    container,
    nodesMapById,
    edgesMapById,
    edgesMapByNodeId,
    options
  );

  innerContainer.appendChild(anchorStartElem);
  innerContainer.appendChild(anchorEndElem);

  if (options?.allowDragNodes === undefined || options?.allowDragNodes) {
    setupNodeDragging({
      nodeElement: nodeElementWrapper,
      anchorStartElement: anchorStartElem,
      anchorEndElement: anchorEndElem,
      node,
      disposer,
      zoomLevelMaintainer: canvasZoomLevelMaintainer,
      nodeMapById: nodesMapById,
      getEdgeListMapByNodeId,
      internalSVGElement: svg,
      container
    });
  }

  innerContainer.appendChild(nodeElementWrapper);
}
