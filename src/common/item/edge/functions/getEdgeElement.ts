export function getEdgeElement(id: string, internalSVGElement: SVGSVGElement) {
    return internalSVGElement.querySelector(`path[data-edge-id="${id}"]`) as SVGElement;
}
