import * as d3 from "d3";
import { CanvasZoomLevelMaintainer } from "../stateMaintainers/CanvasZoomLevelMaintainer";

export const setupCanvasZoomAndPan = (zoomLevelMaintainer: CanvasZoomLevelMaintainer, innerContainer: HTMLElement, container: HTMLElement) => {
    const zoom = d3.zoom<HTMLElement, unknown>();
    zoom.on("zoom", (e) => {
      zoomLevelMaintainer.currentZoom = e.transform.k;
      if (innerContainer) {
        innerContainer.style.transform = `translate(${e.transform.x}px, ${e.transform.y}px) scale(${e.transform.k})`;
      }
    });
    d3.select(container).call(zoom);
}