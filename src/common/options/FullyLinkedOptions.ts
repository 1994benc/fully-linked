export interface FullyLinkedOptions<GlobalNodePropsType> {
  /** The unique id of the FullyLinked graph. */
  id: string;
  /** Element that contains your FullyLinked elements */
  container: HTMLElement;
  /** Should nodes be draggable? Defaulted to true. */
  allowDragNodes?: boolean;

  /**
   * Create a FullyLinked graph with an initial zoom level set to something else other than 1.
   *  If panX, and panY are provided, the graph will be transformed (think css transform(panX, panY)) by panX and panY.
   *  If only initial zoom level is required, please set initialZoomLevel property instead.
   */
  initialCamera?: {
    panX: number;
    panY: number;
    zoomLevel: number;
  };

  globalNodeProps?: GlobalNodePropsType;

  // TODO: zoomTo
}
