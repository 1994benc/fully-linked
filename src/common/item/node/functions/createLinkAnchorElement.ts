import { Disposer } from "../../../disposer/Disposer";
import { CanvasZoomLevelMaintainer } from "../../canvas/stateMaintainers/CanvasZoomLevelMaintainer";
import { CreateNewEdgeStateMaintainer } from "../../edge/stateMaintainers/CreateNewEdgeStateMaintainer";
import { Edge } from "../../edge/types/Edge";
import { InternalNode } from "../types/Node";
import { setUpCreateEdgeOnAnchorDragging } from "./setUpCreateEdgeOnAnchorDragging";

// TODO: make link anchors part of node element instead of separate elements
export function createLinkAnchorElement<NodeType, EdgeType>(
  node: InternalNode<NodeType>,
  internalSVGElement: SVGSVGElement,
  edgePlaceholderId: string,
  createNewEdgeStateMaintainer: CreateNewEdgeStateMaintainer,
  canvasZoomLevelMaintainer: CanvasZoomLevelMaintainer,
  disposer: Disposer,
  container: HTMLElement,
  nodesMapById: Map<string, InternalNode<NodeType>>,
  edgesMapById: Map<string, Edge<EdgeType>>,
  edgesMapByNodeId: Map<string, Edge<EdgeType>[]>
): { anchorStartElem: HTMLElement; anchorEndElem: HTMLElement } {
  const anchorStartElem = document.createElement("div");
  const anchorEndElem = document.createElement("div");

  anchorStartElem.style.position = "absolute";
  anchorStartElem.style.left = node.startAnchorPoint?.x + "px";
  anchorStartElem.style.top = node.startAnchorPoint?.y + "px";
  anchorStartElem.classList.add("fully-linked-node-anchor");
  anchorStartElem.classList.add("anchor-start-element");
  anchorStartElem.style.transform = "translate(-50%, -50%)";
  anchorStartElem.style.background = "black";
  anchorStartElem.style.width = "20px";
  anchorStartElem.style.height = "20px";
  anchorStartElem.setAttribute("data-node-id", node.id);

  anchorEndElem.style.position = "absolute";
  anchorEndElem.style.left = node.endAnchorPoint?.x + "px";
  anchorEndElem.style.top = node.endAnchorPoint?.y + "px";
  anchorEndElem.classList.add("fully-linked-node-anchor");
  anchorEndElem.classList.add("anchor-end-element");

  anchorEndElem.style.transform = "translate(-50%, -50%)";
  anchorEndElem.style.background = "black";
  anchorEndElem.style.width = "20px";
  anchorEndElem.style.height = "20px";
  anchorEndElem.setAttribute("data-node-id", node.id);

  setUpCreateEdgeOnAnchorDragging({
    anchorEndElem,
    anchorStartElem,
    node,
    internalSVGElement: internalSVGElement,
    edgePlaceholderId,
    createNewEdgeStateMaintainer,
    canvasZoomLevelMaintainer,
    disposer,
    container,
    nodeMapById: nodesMapById,
    edgeMapById: edgesMapById,
    edgeListMapByNodeId: edgesMapByNodeId,
  });
  return { anchorStartElem, anchorEndElem };
}
