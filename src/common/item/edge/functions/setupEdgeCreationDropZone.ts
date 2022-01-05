import { Disposer } from "../../../disposer/Disposer";
import {  ProcessedNode } from "../../node/types/Node";
import { CreateNewEdgeStateMaintainer } from "./../stateMaintainers/CreateNewEdgeStateMaintainer";
import { addDisposableEventListener } from "../../../event/addEventListener";
import { createSingleEdge } from "./createSingleEdge";
import { Edge } from "./../types/Edge";
import { FullyLinkedEvent } from "../../../event/FullyLinkedEvent";
import { dispatchFullyLinkedEvent } from "../../../event/dispatchFullyLinkedEvent";
import { FullyLinkedEventEnum } from "../../../..";

export function setUpEdgeCreationDropZone<NodeType, EdgeType, GlobalNodePropsType>(
  anchorStartElem: HTMLDivElement,
  node: ProcessedNode<NodeType, GlobalNodePropsType>,
  creatingNewEdgeStateMaintainer: CreateNewEdgeStateMaintainer,
  disposer: Disposer,
  internalSVGElement: SVGSVGElement,
  nodesMapById: Map<string, ProcessedNode<NodeType, GlobalNodePropsType>>,
  edgesMapById: Map<string, Edge<EdgeType>>,
  edgesMapByNodeId: Map<string, Edge<EdgeType>[]>,
  containerElement: HTMLElement
): void {
  addDisposableEventListener(
    anchorStartElem,
    "mouseup",
    ((e: PointerEvent) => {
      if (creatingNewEdgeStateMaintainer.creatingNewEdge) {
        creatingNewEdgeStateMaintainer.newEdgeMetadata.target = node.id;
        if (
          creatingNewEdgeStateMaintainer.newEdgeMetadata.source &&
          creatingNewEdgeStateMaintainer.newEdgeMetadata.target
        ) {
          const edge = {
            id:
              "NEW_EDGE_" +
              creatingNewEdgeStateMaintainer.newEdgeMetadata.source +
              "-" +
              creatingNewEdgeStateMaintainer.newEdgeMetadata.target,
            source: creatingNewEdgeStateMaintainer.newEdgeMetadata.source,
            target: creatingNewEdgeStateMaintainer.newEdgeMetadata.target,
            data: {} as EdgeType,
          };

          createSingleEdge({
            edge,
            internalSVGElement: internalSVGElement,
            nodesMapById,
            edgesMapById,
            edgesMapByNodeId,
            disposer,
            containerElement,
          });

          // Dispatch an event that the edge has been fully created
          const edgeCreationEndSuccessfullyParams: FullyLinkedEvent<
            NodeType,
            EdgeType,
            Edge<EdgeType>,
            GlobalNodePropsType
          > = {
            item: edge,
            itemType: "edge",
            info: edge,
          };
          dispatchFullyLinkedEvent(
            FullyLinkedEventEnum.manualEdgeCreationEndSuccessfully,
            edgeCreationEndSuccessfullyParams,
            containerElement
          );
        }
      }
    }) as EventListener,
    disposer
  );
}
