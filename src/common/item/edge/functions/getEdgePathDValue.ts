import * as d3 from "d3";
import { curveBumpX } from "d3";
import { InternalNode } from "../node/types/Node";
import { Edge } from "./types/Edge";

export function getEdgePathDValue<NodeType, EdgeType>(
  nodesMapById: Map<string, InternalNode<NodeType>>,
  edge: Edge<EdgeType>
): string | null {
  const sourceNode = nodesMapById.get(edge.source);
  const targetNode = nodesMapById.get(edge.target);
  if (!sourceNode || !targetNode) {
    // TODO: maybe ignore the edge, and continue working on the rest of the edges?
    throw new Error("Source or target node not found");
  }
  const linkGen = d3.line();
  const sourceNodeWidth = sourceNode.width;
  const sourceNodeHeight = sourceNode.height;
  const targetNodeHeight = targetNode.height;
  const sourceX = sourceNode.x;
  const sourceY = sourceNode.y;
  const targetX = targetNode.x;
  const targetY = targetNode.y;
  const singleLinkData = [
    [sourceX + sourceNodeWidth, sourceY + sourceNodeHeight / 2],
    [targetX, targetY + targetNodeHeight / 2],
  ] as [number, number][];
  linkGen.curve(curveBumpX);
  const d = linkGen(singleLinkData);
  return d;
}
