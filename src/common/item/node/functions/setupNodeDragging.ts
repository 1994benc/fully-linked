import { Disposer } from "../../../disposer/Disposer";
import { ProcessedNode } from "./../types/Node";
import { addDisposableEventListener } from "../../../event/addEventListener";
import { CanvasZoomAndTransformMaintainer } from "../../canvas/stateMaintainers/CanvasZoomAndTransformMaintainer";
import { getEdgePathDValue } from "../../edge/functions/getEdgePathDValue";
import { Edge } from "../../edge/types/Edge";
import { setNodeLinkAnchors } from "./setNodeLinkAnchors";
import { NODE_DRAGGING_DISPOSER_KEY } from "../../../disposer/disposerKeys";
import { FullyLinkedEvent } from "../../../event/FullyLinkedEvent";
import { dispatchFullyLinkedEvent } from "../../../event/dispatchFullyLinkedEvent";
import { FullyLinkedEventEnum } from "../../../..";

export interface NodeDraggingSetupParams<NodeType, EdgeType, GlobalNodePropsType> {
  nodeElement: HTMLElement;
  anchorStartElement: HTMLElement;
  anchorEndElement: HTMLElement;
  node: ProcessedNode<NodeType, GlobalNodePropsType>;
  disposer: Disposer;
  zoomLevelMaintainer: CanvasZoomAndTransformMaintainer;
  nodeMapById: Map<string, ProcessedNode<NodeType, GlobalNodePropsType>>;
  getEdgeListMapByNodeId: () => Map<string, Edge<EdgeType>[]>;
  internalSVGElement: SVGSVGElement;
  container: HTMLElement;
}

export function setupNodeDragging<NodeType, EdgeType, GlobalNodePropsType>({
  nodeElement,
  anchorStartElement,
  anchorEndElement,
  node,
  disposer,
  zoomLevelMaintainer,
  nodeMapById: nodesMapById,
  getEdgeListMapByNodeId,
  internalSVGElement: svg,
  container,
}: NodeDraggingSetupParams<NodeType, EdgeType, GlobalNodePropsType>) {
  // Inspired by @LINK https://infoheap.com/javascript-make-element-draggable/
  let dragging = false;
  let dragStartX: number | null;
  let dragStartY: number | null;
  let objInitLeft: number | null;
  let objInitTop: number | null;

  const onMouseDown = (e: MouseEvent): void => {
    // First, dispatch an event that the node is being dragged
    const nodeDraggingStartedParams: FullyLinkedEvent<
      NodeType,
      EdgeType,
      MouseEvent,
      GlobalNodePropsType
    > = {
      item: node,
      itemType: "node",
      info: e,
    };
    dispatchFullyLinkedEvent(
      FullyLinkedEventEnum.nodeDragStart,
      nodeDraggingStartedParams,
      container
    );

    e.stopPropagation();
    dragging = true;
    // Store element page position on mousedown using element.offsetLeft and element.offsetTop
    objInitLeft = nodeElement.offsetLeft;
    objInitTop = nodeElement.offsetTop;
    // Store click event’s page position on mousedown using event.pageX and event.pageY.
    // Note that this will be slightly different from element’s position depending upon where did use click within element.
    dragStartX = e.pageX;
    dragStartY = e.pageY;
  };
  addDisposableEventListener(
    nodeElement,
    "mousedown",
    onMouseDown as EventListener,
    disposer,
    NODE_DRAGGING_DISPOSER_KEY
  );
  const onMouseMove = (e: MouseEvent): void => {
    if (dragging && objInitLeft && objInitTop && dragStartX && dragStartY) {
      e.stopPropagation();
      // xDelta and yDelta are the difference between current mouse position and the position on mousedown
      const xDelta = e.pageX - dragStartX;
      const x = objInitLeft + xDelta / zoomLevelMaintainer.currentZoom;
      const yDelta = e.pageY - dragStartY;
      const y = objInitTop + yDelta / zoomLevelMaintainer.currentZoom;
      nodeElement.style.left = x + "px";
      nodeElement.style.top = y + "px";
      node.x = x;
      node.y = y;
      setNodeLinkAnchors(node);
      anchorStartElement.style.left = node.startAnchorPoint?.x + "px";
      anchorStartElement.style.top = node.startAnchorPoint?.y + "px";
      anchorEndElement.style.left = node.endAnchorPoint?.x + "px";
      anchorEndElement.style.top = node.endAnchorPoint?.y + "px";

      nodesMapById.set(node.id, node);
      const edgesMapByNodeId = getEdgeListMapByNodeId();
      const edges = edgesMapByNodeId.get(node.id);
      if (edges) {
        for (const edge of edges) {
          const d = getEdgePathDValue(nodesMapById, edge);
          const path = svg?.querySelector(
            `path[data-edge-id="${edge.id}"]`
          ) as SVGElement;
          if (d && path) {
            path.setAttribute("d", d);
          }
        }
      }
      // Dispatch an event that the node is being dragged
      const nodeDraggingParams: FullyLinkedEvent<
        NodeType,
        EdgeType,
        MouseEvent,
        GlobalNodePropsType
      > = {
        item: node,
        itemType: "node",
        info: e,
      };
      dispatchFullyLinkedEvent(
        FullyLinkedEventEnum.nodeDrag,
        nodeDraggingParams,
        container
      );
    }
  };
  // add "mousemove" event listener to the document because user can move the mouse outside the element
  // after having started dragging the element without lifting the mouse button first
  addDisposableEventListener(
    document,
    "mousemove",
    onMouseMove as EventListener,
    disposer,
    NODE_DRAGGING_DISPOSER_KEY
  );
  const onMouseUp = (e: MouseEvent): void => {
    if (dragging) {
      dragging = false;
      objInitLeft = null;
      objInitTop = null;
      dragStartX = null;
      dragStartY = null;
      e.stopPropagation();
      // Dispatch an event that the node drag has ended
      const nodeDraggingEndedParams: FullyLinkedEvent<
        NodeType,
        EdgeType,
        MouseEvent,
        GlobalNodePropsType
      > = {
        item: node,
        itemType: "node",
        info: e,
      };
      dispatchFullyLinkedEvent(
        FullyLinkedEventEnum.nodeDragEnd,
        nodeDraggingEndedParams,
        container
      );
    }
  };
  // add "mouseup" event listener to the document because user can trigger mouseup anywhere on the page
  // and we need to stop dragging when user does that
  addDisposableEventListener(
    document,
    "mouseup",
    onMouseUp as EventListener,
    disposer,
    NODE_DRAGGING_DISPOSER_KEY
  );
}
