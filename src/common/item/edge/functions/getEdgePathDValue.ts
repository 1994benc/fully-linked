import * as d3 from "d3";
import { curveBumpX } from "d3";
import { ProcessedNode } from "../../node/types/Node";
import { Edge } from "../types/Edge";

export function getEdgePathDValue<NodeType, EdgeType, GlobalNodePropsType>(
  nodesMapById: Map<string, ProcessedNode<NodeType, GlobalNodePropsType>>,
  edge: Edge<EdgeType>
): string | null {
  const sourceNode = nodesMapById.get(edge.source);
  const targetNode = nodesMapById.get(edge.target);
  if (!sourceNode || !targetNode) {
    // Return null so you can ignore this edge
    return null
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
