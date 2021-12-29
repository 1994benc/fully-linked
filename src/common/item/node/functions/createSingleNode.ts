import { Disposer } from "../../../disposer/Disposer";
import { FullyLinkedOptions } from "../../../options/FullyLinkedOptions";
import { CanvasZoomLevelMaintainer } from "../../canvas/stateMaintainers/CanvasZoomLevelMaintainer";
import { CreateNewEdgeStateMaintainer } from "../../edge/stateMaintainers/CreateNewEdgeStateMaintainer";
import { Edge } from "../../edge/types/Edge";
import { createLinkAnchorElement } from "./createLinkAnchorElement";
import { InternalNode } from "../types/Node";
import { setupNodeDragging } from "./setupNodeDragging";

export interface CreateSingleNodeParams<NodeType, EdgeType> {
  node: InternalNode<NodeType>;
  innerContainer: HTMLElement;
  container: HTMLElement;
  options: FullyLinkedOptions;
  createNewEdgeStateMaintainer: CreateNewEdgeStateMaintainer;
  canvasZoomLevelMaintainer: CanvasZoomLevelMaintainer;
  internalSVGElement: SVGSVGElement;
  edgePlaceholderId: string;
  disposer: Disposer;
  nodesMapById: Map<string, InternalNode<NodeType>>;
  edgesMapById: Map<string, Edge<EdgeType>>;
  edgesMapByNodeId: Map<string, Edge<EdgeType>[]>;
}

export function createSingleNode<NodeType, EdgeType>({
  node,
  innerContainer,
  container,
  options,
  createNewEdgeStateMaintainer,
  canvasZoomLevelMaintainer,
  internalSVGElement: svg,
  edgePlaceholderId,
  disposer,
  nodesMapById,
  edgesMapById,
  edgesMapByNodeId,
}: CreateSingleNodeParams<NodeType, EdgeType>) {
  let nodeElement: HTMLElement;
  if (node.customNodeElement) {
    nodeElement = node.customNodeElement(node);
  } else {
    nodeElement = document.createElement("div");
    nodeElement.classList.add("fully-linked-node");
  }
  nodeElement.style.position = "absolute";
  nodeElement.style.left = `${node.x}px`;
  nodeElement.style.top = `${node.y}px`;
  nodeElement.style.transformOrigin = "center";
  nodeElement.style.cursor = "grab";
  nodeElement.setAttribute("data-node-id", node.id);

  if (!node.customNodeElement) {
    nodeElement.innerText = node.id;
  }

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
    edgesMapByNodeId
  );

  innerContainer.appendChild(anchorStartElem);
  innerContainer.appendChild(anchorEndElem);

  if (options?.allowDragNodes === undefined || options?.allowDragNodes) {
    setupNodeDragging({
      nodeElement,
      anchorStartElement: anchorStartElem,
      anchorEndElement: anchorEndElem,
      node,
      disposer,
      zoomLevelMaintainer: canvasZoomLevelMaintainer,
      nodeMapById: nodesMapById,
      edgeListMapByNodeId: edgesMapByNodeId,
      internalSVGElement: svg,
    });
  }

  innerContainer.appendChild(nodeElement);
}
