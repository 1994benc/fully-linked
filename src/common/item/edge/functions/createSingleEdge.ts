import { InternalNode } from "../../node/types/Node";
import { Edge } from "../types/Edge";
import { getEdgeElement } from "./getEdgeElement";
import { getEdgePathDValue } from "./getEdgePathDValue";

interface SingleEdgeCreationParams<EdgeType, NodeType> {
  edge: Edge<EdgeType>;
  internalSVGElement: SVGSVGElement;
  nodesMapById: Map<string, InternalNode<NodeType>>;
  edgesMapById: Map<string, Edge<EdgeType>>;
  edgesMapByNodeId: Map<string, Edge<EdgeType>[]>;
}

export function createSingleEdge<NodeType, EdgeType>({
  edge,
  internalSVGElement: svg,
  nodesMapById,
  edgesMapById,
  edgesMapByNodeId,
}: SingleEdgeCreationParams<EdgeType, NodeType>): void {
  const sourceNode = nodesMapById.get(edge.source);
  const targetNode = nodesMapById.get(edge.target);
  if (!sourceNode || !targetNode) {
    // Ignore this edge without throwing an error
    return;
  }
  edgesMapById.set(edge.id, edge);
  edgesMapByNodeId.get(edge.source);
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

  const existingEdgeElement = getEdgeElement(edge.id, svg);
  if (existingEdgeElement) {
    existingEdgeElement.remove();
  }
  const d = getEdgePathDValue(nodesMapById, edge);
  if (d) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "1");
    path.setAttribute("fill", "none");
    path.setAttribute("data-edge-id", edge.id);
    if (!svg) {
      throw new Error("svg is required");
    }
    svg?.appendChild(path);
  }
}
