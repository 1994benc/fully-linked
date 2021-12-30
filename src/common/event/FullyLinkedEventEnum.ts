export enum FullyLinkedEventEnum {
  // The following events are not yet implemented:
  //   edgeCreationCancel = "edgeCreationCancel",
  //   canvasClick = "canvasClick",
  //   canvasDblClick = "canvasDblClick",
  //   canvasRightClick = "canvasRightClick",
  //   canvasDragStart = "canvasDragStart",
  //   canvasDragEnd = "canvasDragEnd",
  //   canvasDrag = "canvasDrag",
  //   canvasZoom = "canvasZoom",
  //   canvasZoomStart = "canvasZoomStart",
  //   canvasZoomEnd = "canvasZoomEnd",

  //   The following are available to use:
  beforeUpdateData = "beforeUpdateData",
  afterUpdateData = "afterUpdateData",
  beforeRemoveNode = "beforeRemoveNode",
  afterRemoveNode = "afterRemoveNode",
  beforeRemoveEdge = "beforeRemoveEdge",
  afterRemoveEdge = "afterRemoveEdge",
  beforeSetData = "beforeSetData",
  afterSetData = "afterSetData",
  beforeRender = "beforeRender",
  afterRender = "afterRender",
  edgeClick = "edgeClick",
  edgeDblClick = "edgeDblClick",
  edgeRightClick = "edgeRightClick",
  /** Only fired when user starts to create a new edge by dragging a node link anchor */
  manualEdgeCreationStart = "manualEdgeCreationStart",
  /** Fired everytime an edge has been created regardless of the method used */
  edgeCreated = "edgeCreated",
  /** Fired when user has finished creating an edge by dropping the new edge into the target's link anchor */
  manualEdgeCreationEndSuccessfully = "manualEdgeCreationEndSuccessfully",
  nodeDragStart = "nodeDragStart",
  nodeDragEnd = "nodeDragEnd",
  nodeDrag = "nodeDrag",
}
