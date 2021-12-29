import { Disposer } from "../../../disposer/Disposer";
import { InternalNode } from "../../node/types/Node";
import { CreateNewEdgeStateMaintainer } from "./../stateMaintainers/CreateNewEdgeStateMaintainer";
import { addDisposableEventListener } from "../../../event/addEventListener";
import { createSingleEdge } from "./createSingleEdge";
import { Edge } from "./../types/Edge";

export function setUpEdgeCreationDropZone<NodeType, EdgeType>(
  anchorStartElem: HTMLDivElement,
  node: InternalNode<NodeType>,
  creatingNewEdgeStateMaintainer: CreateNewEdgeStateMaintainer,
  disposer: Disposer,
  internalSVGElement: SVGSVGElement,
  nodesMapById: Map<string, InternalNode<NodeType>>,
  edgesMapById: Map<string, Edge<EdgeType>>,
  edgesMapByNodeId: Map<string, Edge<EdgeType>[]>
): void {
  addDisposableEventListener(
    anchorStartElem,
    "mouseup",
    ((e: PointerEvent) => {
      if (creatingNewEdgeStateMaintainer.creatingNewEdge) {
        console.log("enter dropzone and creating new edge", e);
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
          createSingleEdge(
            { edge, internalSVGElement: internalSVGElement, nodesMapById, edgesMapById, edgesMapByNodeId }          );
        }
      }
    }) as EventListener,
    disposer
  );
}
