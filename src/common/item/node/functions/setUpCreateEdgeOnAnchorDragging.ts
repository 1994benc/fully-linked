import * as d3 from "d3";
import { curveBumpX } from "d3";
import { Disposer } from "../../../disposer/Disposer";
import { CreateNewEdgeStateMaintainer } from "../../edge/stateMaintainers/CreateNewEdgeStateMaintainer";
import { ProcessedNode } from "./../types/Node";
import { addDisposableEventListener } from "../../../event/addEventListener";
import { CanvasZoomAndTransformMaintainer } from "../../canvas/stateMaintainers/CanvasZoomAndTransformMaintainer";
import { Edge } from "../../edge/types/Edge";
import { setUpEdgeCreationDropZone } from "../../edge/functions/setupEdgeCreationDropZone";
import { FullyLinkedEvent } from "../../../event/FullyLinkedEvent";
import { dispatchFullyLinkedEvent } from "../../../event/dispatchFullyLinkedEvent";
import { FullyLinkedEventEnum } from "../../../..";
import { FullyLinkedOptions } from "../../../options/FullyLinkedOptions";

interface CreateEdgeOnAnchorDraggingParams<NodeType, EdgeType, GlobalNodePropsType> {
  anchorEndElem: HTMLDivElement;
  anchorStartElem: HTMLDivElement;
  node: ProcessedNode<NodeType, GlobalNodePropsType>;
  internalSVGElement: SVGSVGElement | undefined;
  edgePlaceholderId: string;
  createNewEdgeStateMaintainer: CreateNewEdgeStateMaintainer;
  canvasZoomLevelMaintainer: CanvasZoomAndTransformMaintainer;
  disposer: Disposer;
  container: HTMLElement;
  nodeMapById: Map<string, ProcessedNode<NodeType, GlobalNodePropsType>>;
  edgeMapById: Map<string, Edge<EdgeType>>;
  edgeListMapByNodeId: Map<string, Edge<EdgeType>[]>;
  options: FullyLinkedOptions<GlobalNodePropsType>;
}

/** When user drags an "end anchor" element, a new placeholder edge should be created.
 * The placeholder edge should become a real edge when the user drops the end of the edge onto another node's "start anchor" */
export function setUpCreateEdgeOnAnchorDragging<NodeType, EdgeType, GlobalNodePropsType>({
  anchorEndElem,
  anchorStartElem,
  node,
  internalSVGElement: svg,
  edgePlaceholderId,
  createNewEdgeStateMaintainer,
  canvasZoomLevelMaintainer,
  disposer,
  container,
  edgeMapById: edgesMapById,
  edgeListMapByNodeId: edgesMapByNodeId,
  nodeMapById: nodesMapById,
  options
}: CreateEdgeOnAnchorDraggingParams<NodeType, EdgeType, GlobalNodePropsType>) {
  // Positions
  let dragStartX: number;
  let dragStartY: number;
  let objInitLeft: number;
  let objInitTop: number;

  const anchorEndMouseDownListener = (e: PointerEvent) => {
    // First, dispatch edgeCreationStart event
    const beforeEdgeCreationParams: FullyLinkedEvent<NodeType, EdgeType, {}, GlobalNodePropsType> = {
      item: null,
      itemType: "edge",
      info: {},
    };
    dispatchFullyLinkedEvent(
      FullyLinkedEventEnum.manualEdgeCreationStart,
      beforeEdgeCreationParams,
      container
    );

    e.stopPropagation();
    // remove any old placeholder paths if exist
    const oldPath = svg?.querySelector(
      `path[data-edge-id="${edgePlaceholderId}"]`
    ) as SVGElement;
    oldPath?.remove();

    const linkGen = d3.line();
    const singleLinkData = [
      [node.endAnchorPoint?.x, node.endAnchorPoint?.y],
      [node.endAnchorPoint?.x, node.endAnchorPoint?.y],
    ] as [number, number][];
    linkGen.curve(curveBumpX);
    const d = linkGen(singleLinkData);

    if (d) {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", d);
      path.setAttribute("stroke", options.defaultEdgeStyles?.stroke || "black");
      path.setAttribute("stroke-width", (options.defaultEdgeStyles?.strokeWidth || 1).toString());
      path.setAttribute("fill", options.defaultEdgeStyles?.fill ||"none");
      path.setAttribute("data-edge-id", edgePlaceholderId);

      // Set initial positions
      objInitTop = anchorEndElem.offsetTop;
      objInitLeft = anchorEndElem.offsetLeft;
      dragStartX = e.pageX;
      dragStartY = e.pageY;

      svg?.appendChild(path);
      createNewEdgeStateMaintainer.creatingNewEdge = true;
      createNewEdgeStateMaintainer.newEdgeMetadata.source = node.id;
    }
  };
  addDisposableEventListener(
    anchorEndElem,
    "mousedown",
    anchorEndMouseDownListener as EventListener,
    disposer
  );

  const anchorEndMouseMoveListener = (e: PointerEvent) => {
    if (
      createNewEdgeStateMaintainer.creatingNewEdge &&
      objInitTop &&
      objInitLeft &&
      dragStartX &&
      dragStartY &&
      node.id === createNewEdgeStateMaintainer.newEdgeMetadata.source
    ) {
      console.log(node.id);
      e.stopPropagation();

      const xDelta = e.pageX - dragStartX;
      const x = objInitLeft + xDelta / canvasZoomLevelMaintainer.currentZoom;
      const yDelta = e.pageY - dragStartY;
      const y = objInitTop + yDelta / canvasZoomLevelMaintainer.currentZoom;

      const linkGen = d3.line();
      const singleLinkData = [
        [node.endAnchorPoint?.x, node.endAnchorPoint?.y],
        [x, y],
      ] as [number, number][];
      linkGen.curve(curveBumpX);
      const d = linkGen(singleLinkData);
      const path = svg?.querySelector(
        `path[data-edge-id="${edgePlaceholderId}"]`
      ) as SVGElement;
      if (d) {
        path.setAttribute("d", d);
      }
    }
  };
  if (!container) {
    throw new Error("No container found");
  }
  addDisposableEventListener(
    container,
    "mousemove",
    anchorEndMouseMoveListener as EventListener,
    disposer
  );

  const anchorEndMouseUpListener = (e: Event) => {
    createNewEdgeStateMaintainer.creatingNewEdge = false;
    // remove placeholder edge
    const path = svg?.querySelector(
      `path[data-edge-id="${edgePlaceholderId}"]`
    ) as SVGElement;
    path?.remove();

    // Cancel creation
    createNewEdgeStateMaintainer.newEdgeMetadata.source = null;
    createNewEdgeStateMaintainer.newEdgeMetadata.target = null;
  };
  if (!container) {
    throw new Error("No container found");
  }
  addDisposableEventListener(
    container,
    "mouseup",
    anchorEndMouseUpListener,
    disposer
  );

  setUpEdgeCreationDropZone(
    anchorStartElem,
    node,
    createNewEdgeStateMaintainer,
    disposer,
    svg as SVGSVGElement,
    nodesMapById,
    edgesMapById,
    edgesMapByNodeId,
    container,
    options
  );
}
