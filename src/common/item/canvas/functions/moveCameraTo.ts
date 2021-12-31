
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
  containerSelection.call(zoom.scaleBy, e.transform.k);
  containerSelection.call(zoom.translateBy, e.transform.x, e.transform.y);
}
