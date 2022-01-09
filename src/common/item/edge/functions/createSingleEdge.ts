import { FullyLinkedEventEnum } from "../../../..";
import { Disposer } from "../../../disposer/Disposer";
import { addDisposableEventListener } from "../../../event/addEventListener";
import { dispatchFullyLinkedEvent } from "../../../event/dispatchFullyLinkedEvent";
import { FullyLinkedEvent } from "../../../event/FullyLinkedEvent";
import { ProcessedNode } from "../../node/types/Node";
import { Edge } from "../types/Edge";
import { getEdgeElement } from "./getEdgeElement";
import { getEdgePathDValue } from "./getEdgePathDValue";

interface SingleEdgeCreationParams<EdgeType, NodeType, GlobalNodePropsType> {
  edge: Edge<EdgeType>;
  internalSVGElement: SVGSVGElement;
  nodesMapById: Map<string, ProcessedNode<NodeType, GlobalNodePropsType>>;
  edgesMapById: Map<string, Edge<EdgeType>>;
  edgesMapByNodeId: Map<string, Edge<EdgeType>[]>;
  disposer: Disposer;
  containerElement: HTMLElement;
}

export function createSingleEdge<NodeType, EdgeType, GlobalNodePropsType>({
  edge,
  internalSVGElement: svg,
  nodesMapById,
  edgesMapById,
  edgesMapByNodeId,
  disposer,
  containerElement,
}: SingleEdgeCreationParams<EdgeType, NodeType, GlobalNodePropsType>): void {
  const sourceNode = nodesMapById.get(edge.source);
  const targetNode = nodesMapById.get(edge.target);
  if (!sourceNode || !targetNode) {
    // Ignore this edge without throwing an error
    return;
  }
  edgesMapById.set(edge.id, edge);
  if (!edgesMapByNodeId.has(edge.source)) {
    edgesMapByNodeId.set(edge.source, [edge]);
  } else {
    edgesMapByNodeId.get(edge.source)?.push(edge);
  }
  if (!edgesMapByNodeId.has(edge.target)) {
    edgesMapByNodeId.set(edge.target, [edge]);
  } else {
    edgesMapByNodeId.get(edge.target)?.push(edge);
  }

  const d = getEdgePathDValue(nodesMapById, edge);
  if (d) {
    const existingEdgeElement = getEdgeElement(edge.id, svg);
    if (existingEdgeElement) {
      existingEdgeElement.setAttribute("d", d);
    } else {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", d);
      path.setAttribute("stroke", edge.styles?.stroke || "black");
      path.setAttribute(
        "stroke-width",
        (edge.styles?.strokeWidth || 1).toString()
      );
      path.setAttribute("fill", edge.styles?.fill || "none");
      path.setAttribute("data-edge-id", edge.id);
      addDisposableEventListener(
        path,
        "click",
        (event) => {
          const eventParams: FullyLinkedEvent<
            NodeType,
            EdgeType,
            Event,
            GlobalNodePropsType
          > = {
            info: event,
            item: edge,
            itemType: "edge",
          };
          dispatchFullyLinkedEvent(
            FullyLinkedEventEnum.edgeClick,
            eventParams,
            containerElement
          );
        },
        disposer
      );

      addDisposableEventListener(
        path,
        "dblclick",
        (event) => {
          const eventParams: FullyLinkedEvent<
            NodeType,
            EdgeType,
            Event,
            GlobalNodePropsType
          > = {
            info: event,
            item: edge,
            itemType: "edge",
          };
          dispatchFullyLinkedEvent(
            FullyLinkedEventEnum.edgeDblClick,
            eventParams,
            containerElement
          );
        },
        disposer
      );

      addDisposableEventListener(
        path,
        "contextmenu",
        ((event: PointerEvent) => {
          event.preventDefault();
          const eventParams: FullyLinkedEvent<
            NodeType,
            EdgeType,
            Event,
            GlobalNodePropsType
          > = {
            info: event,
            item: edge,
            itemType: "edge",
          };
          dispatchFullyLinkedEvent(
            FullyLinkedEventEnum.edgeRightClick,
            eventParams,
            containerElement
          );
        }) as EventListener,
        disposer
      );

      if (!svg) {
        throw new Error("svg is required");
      }
      svg?.appendChild(path);

      // Dispatch event that the edge has been created
      const eventParams: FullyLinkedEvent<
        NodeType,
        EdgeType,
        {},
        GlobalNodePropsType
      > = {
        info: {},
        item: edge,
        itemType: "edge",
      };
      dispatchFullyLinkedEvent(
        FullyLinkedEventEnum.edgeCreated,
        eventParams,
        containerElement
      );
    }
  }
}
