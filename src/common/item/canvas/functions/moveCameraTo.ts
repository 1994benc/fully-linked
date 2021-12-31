import { ZoomTransform } from "d3";

export interface MoveCameraParams {
  transform: {
    x: number;
    y: number;
    k: number;
  };
}

/** DO NOT use inside d3 on zoom callback */
export function moveCameraTo(
  zoom: d3.ZoomBehavior<HTMLElement, any>,
  containerSelection: d3.Selection<HTMLElement, any, any, any>,
  e: MoveCameraParams
) {
  containerSelection.call(
    zoom.transform,
    new ZoomTransform(e.transform.k, e.transform.x, e.transform.y)
  );
}
