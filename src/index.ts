import { Disposer } from "./fully-linked/Disposer";
import {
  FullyLinkedData,
  InternalFullyLinkedData,
} from "./fully-linked/FullyLinkedData";
import { FullyLinkedOptions } from "./fully-linked/FullyLinkedOptions";
import { InternalNode, Node } from "./fully-linked/Node";
import * as d3 from "d3";
import { Edge } from "./fully-linked/Edge";
import { curveBumpX } from "d3";
import { addEventListener } from "./utils/event/addEventListener";
const edgePlaceholderId = "placeholder-edge";

export class FullyLinked<NodeType, EdgeType> {
  private _container: HTMLElement | null;
  private _options: FullyLinkedOptions | null;
  private _disposer: Disposer;
  private _svg: SVGSVGElement | undefined;
  private _nodesMapById: Map<string, InternalNode<NodeType>> = new Map();
  private _edgesMapById: Map<string, Edge<EdgeType>> = new Map();
  /** key is a nodeId and values are edges that are linked to the node */
  private _edgesMapByNodeId: Map<string, Edge<EdgeType>[]> = new Map();
  private _innerContainer: HTMLDivElement | undefined;
  private _zoomLevel: number = 1;
  private _creatingNewEdge: boolean = false;
  private _newEdgeBeingCreatedMetadata: {
    source: string | null;
    target: string | null;
  } = {
    source: null,
    target: null,
  };

  constructor(options: FullyLinkedOptions) {
    this._disposer = new Disposer();
    this._options = options;
    this._container = options.container;
    this._disposer.add({
      dispose: () => {
        this._options = null;
        this._container?.remove();
        this._container = null;
      },
    });
  }

  public setData(data: FullyLinkedData<NodeType, EdgeType>): void {
    const internalData: InternalFullyLinkedData<NodeType, EdgeType> = {
      ...data,
    };
    for (const node of internalData.nodes) {
      this.setNodeLinkAnchors(node);
      this._nodesMapById.set(node.id, node);
    }

    for (const edge of internalData.edges) {
      this._edgesMapById.set(edge.id, edge);
      if (!this._edgesMapByNodeId.has(edge.source)) {
        this._edgesMapByNodeId.set(edge.source, [edge]);
      } else {
        this._edgesMapByNodeId.get(edge.source)?.push(edge);
      }
      if (!this._edgesMapByNodeId.has(edge.target)) {
        this._edgesMapByNodeId.set(edge.target, [edge]);
      } else {
        this._edgesMapByNodeId.get(edge.target)?.push(edge);
      }
    }
  }

  private setNodeLinkAnchors(node: InternalNode<NodeType>) {
    node.startAnchorPoint = {
      x: node.x,
      y: node.y + node.height / 2,
    };
    node.endAnchorPoint = {
      x: node.x + node.width,
      y: node.y + node.height / 2,
    };
  }

  /** Initialises and renders a FullyLinked graph */
  public render(): void {
    if (!this._container) {
      throw new Error("Container is not set or is undefined");
    }

    this._innerContainer = document.createElement("div");
    this._innerContainer.style.width = "100%";
    this._innerContainer.style.height = "100%";
    this._innerContainer.style.position = "relative";

    this._container.appendChild(this._innerContainer);
    this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._svg.classList.add("fully-linked-svg-" + this._options?.id);
    this._svg.style.position = "absolute";
    this._svg.style.top = "0";
    this._svg.style.left = "0";
    this._svg.setAttribute("width", "100%");
    this._svg.setAttribute("height", "100%");
    this._svg.setAttribute("overflow", "visible");
    this._innerContainer.appendChild(this._svg);
    this._disposer.add({
      dispose: () => {
        this._svg?.remove();
      },
    });

    this.createNodesAndSetNodeMapById();

    this.createEdges();

    this.setupCanvasZooming();
  }

  public addEdge = (edge: Edge<EdgeType>) => {
    this._edgesMapById.set(edge.id, edge);
    this._edgesMapByNodeId.get(edge.source);
    if (!this._edgesMapByNodeId.has(edge.source)) {
      this._edgesMapByNodeId.set(edge.source, [edge]);
    } else {
      this._edgesMapByNodeId.get(edge.source)?.push(edge);
    }
    if (!this._edgesMapByNodeId.has(edge.target)) {
      this._edgesMapByNodeId.set(edge.target, [edge]);
    } else {
      this._edgesMapByNodeId.get(edge.target)?.push(edge);
    }

    const existingEdgeElement = this.getEdgeElement(edge.id);
    if (existingEdgeElement) {
      existingEdgeElement.remove();
    }

    this.createSingleEdge(edge);
  };

  /** Checks that an edge exists. This checks the actual element in the DOM not just in the data */
  public hasEdgeElement(id: string): boolean {
    const edge = this.getEdgeElement(id);
    return !!edge;
  }

  private getEdgeElement(id: string) {
    return this._svg?.querySelector(`path[data-edge-id="${id}"]`) as SVGElement;
  }

  /** Checks that a node exists. This checks the actual element in the DOM not just in the data */
  public hasNodeElement(id: string): boolean {
    const node = this.getNodeElement(id);
    return !!node;
  }

  private getNodeElement(id: string) {
    return this._container?.querySelector(
      `[data-node-id="${id}"]`
    ) as SVGElement;
  }

  // SECTION private methods:
  private setupCanvasZooming() {
    const zoom = d3.zoom<any, any>();
    zoom.on("zoom", (e) => {
      this._zoomLevel = e.transform.k;
      if (this._innerContainer) {
        this._innerContainer.style.transform = `translate(${e.transform.x}px, ${e.transform.y}px) scale(${e.transform.k})`;
      }
    });
    d3.select(this._container).call(zoom);
  }

  private createEdges() {
    for (const [key, edge] of this._edgesMapById.entries()) {
      this.createSingleEdge(edge);
    }
  }

  private createSingleEdge(edge: Edge<EdgeType>) {
    const d = this.getEdgePathDValue(edge);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    if (d) {
      path.setAttribute("d", d);
      path.setAttribute("stroke", "black");
      path.setAttribute("stroke-width", "1");
      path.setAttribute("fill", "none");
      path.setAttribute("data-edge-id", edge.id);
      this._svg?.appendChild(path);
    }
  }

  private getEdgePathDValue(edge: Edge<EdgeType>) {
    const sourceNode = this._nodesMapById.get(edge.source);
    const targetNode = this._nodesMapById.get(edge.target);
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

  public destroy(): void {
    this._disposer.dispose();
  }

  private createNodesAndSetNodeMapById() {
    for (const [nodeId, node] of this._nodesMapById.entries()) {
      this._nodesMapById.set(node.id, node);
      let nodeElement: HTMLElement;
      if (node.customNodeElement) {
        nodeElement = node.customNodeElement(node);
      } else {
        nodeElement = document.createElement("div");
        nodeElement.classList.add("fully-linked-node");
      }
      nodeElement.style.position = "absolute";
      nodeElement.style.left = `${node.x}px`;
      nodeElement.style.top = `${node.y}px`;
      nodeElement.style.transformOrigin = "center";
      nodeElement.style.cursor = "grab";
      nodeElement.setAttribute("data-node-id", node.id);

      if (!node.customNodeElement) {
        nodeElement.innerText = node.id;
      }

      // Create anchor point elements
      const { anchorStartElem, anchorEndElem } =
        this.createLinkAnchorElement(node);

      this._innerContainer?.appendChild(anchorStartElem);
      this._innerContainer?.appendChild(anchorEndElem);

      if (
        this._options?.allowDragNodes === undefined ||
        this._options?.allowDragNodes
      ) {
        this.setupNodeDragging(
          nodeElement,
          anchorStartElem,
          anchorEndElem,
          node
        );
      }

      this._innerContainer?.appendChild(nodeElement);
    }
  }

  private createLinkAnchorElement(node: InternalNode<NodeType>) {
    const anchorStartElem = document.createElement("div");
    const anchorEndElem = document.createElement("div");

    anchorStartElem.style.position = "absolute";
    anchorStartElem.style.left = node.startAnchorPoint?.x + "px";
    anchorStartElem.style.top = node.startAnchorPoint?.y + "px";
    anchorStartElem.classList.add("anchor-point-element");
    anchorStartElem.style.transform = "translate(-50%, -50%)";
    anchorStartElem.style.background = "black";
    anchorStartElem.style.width = "20px";
    anchorStartElem.style.height = "20px";
    anchorStartElem.setAttribute("data-node-id", node.id);

    anchorEndElem.style.position = "absolute";
    anchorEndElem.style.left = node.endAnchorPoint?.x + "px";
    anchorEndElem.style.top = node.endAnchorPoint?.y + "px";
    anchorEndElem.classList.add("anchor-point-element");
    anchorEndElem.style.transform = "translate(-50%, -50%)";
    anchorEndElem.style.background = "black";
    anchorEndElem.style.width = "20px";
    anchorEndElem.style.height = "20px";
    anchorEndElem.setAttribute("data-node-id", node.id);

    this.setUpCreateEdgeOnAnchorDragging(anchorEndElem, anchorStartElem, node);
    return { anchorStartElem, anchorEndElem };
  }

  /** When user drags an "end anchor" element, a new placeholder edge should be created.
   * The placeholder edge should become a real edge when the user drops the end of the edge onto another node's "start anchor" */
  private setUpCreateEdgeOnAnchorDragging(
    anchorEndElem: HTMLDivElement,
    anchorStartElem: HTMLDivElement,
    node: InternalNode<NodeType>
  ) {
    // Positions
    let dragStartX: number;
    let dragStartY: number;
    let objInitLeft: number;
    let objInitTop: number;

    const anchorEndMouseDownListener = (e: PointerEvent) => {
      e.stopPropagation();
      console.log(
        "Mousedown",
        dragStartX,
        dragStartY,
        objInitLeft,
        objInitTop,
        node.id,
        anchorEndElem
      );
      // remove any old placeholder paths if exist
      const oldPath = this._svg?.querySelector(
        `path[data-edge-id="${edgePlaceholderId}"]`
      ) as SVGElement;
      oldPath?.remove();

      const linkGen = d3.line();
      const singleLinkData = [
        [node.endAnchorPoint?.x, node.endAnchorPoint?.y],
        [node.endAnchorPoint?.x, node.endAnchorPoint?.y],
      ] as [number, number][];
      linkGen.curve(curveBumpX);
      const d = linkGen(singleLinkData);
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      if (!d) {
        throw new Error("No path could be generated");
      }
      path.setAttribute("d", d);
      path.setAttribute("stroke", "black");
      path.setAttribute("stroke-width", "1");
      path.setAttribute("fill", "none");
      path.setAttribute("data-edge-id", edgePlaceholderId);

      // Set initial positions
      objInitTop = anchorEndElem.offsetTop;
      objInitLeft = anchorEndElem.offsetLeft;
      dragStartX = e.pageX;
      dragStartY = e.pageY;

      this._svg?.appendChild(path);
      this._creatingNewEdge = true;
      this._newEdgeBeingCreatedMetadata.source = node.id;
    };
    addEventListener(
      anchorEndElem,
      "mousedown",
      anchorEndMouseDownListener as EventListener,
      this._disposer
    );

    const anchorEndMouseMoveListener = (e: PointerEvent) => {
      if (
        this._creatingNewEdge &&
        objInitTop &&
        objInitLeft &&
        dragStartX &&
        dragStartY &&
        node.id === this._newEdgeBeingCreatedMetadata.source
      ) {
        console.log(node.id);
        e.stopPropagation();

        const xDelta = e.pageX - dragStartX;
        const x = objInitLeft + xDelta / this._zoomLevel;
        const yDelta = e.pageY - dragStartY;
        const y = objInitTop + yDelta / this._zoomLevel;

        const linkGen = d3.line();
        const singleLinkData = [
          [node.endAnchorPoint?.x, node.endAnchorPoint?.y],
          [x, y],
        ] as [number, number][];
        linkGen.curve(curveBumpX);
        const d = linkGen(singleLinkData);
        const path = this._svg?.querySelector(
          `path[data-edge-id="${edgePlaceholderId}"]`
        ) as SVGElement;
        if (!d) {
          throw new Error("No path found");
        }
        path.setAttribute("d", d);
      }
    };
    if (!this._container) {
      throw new Error("No container found");
    }
    addEventListener(
      this._container,
      "mousemove",
      anchorEndMouseMoveListener as EventListener,
      this._disposer
    );

    const anchorEndMouseUpListener = (e: Event) => {
      this._creatingNewEdge = false;
      // remove placeholder edge
      const path = this._svg?.querySelector(
        `path[data-edge-id="${edgePlaceholderId}"]`
      ) as SVGElement;
      path?.remove();

      // Cancel creation
      this._newEdgeBeingCreatedMetadata.source = null;
      this._newEdgeBeingCreatedMetadata.target = null;
    };
    if (!this._container) {
      throw new Error("No container found");
    }
    addEventListener(
      this._container,
      "mouseup",
      anchorEndMouseUpListener,
      this._disposer
    );

    this.setUpEdgeCreationDropZone(anchorStartElem, node);
  }

  private setUpEdgeCreationDropZone(
    anchorStartElem: HTMLDivElement,
    node: InternalNode<NodeType>
  ) {
    addEventListener(
      anchorStartElem,
      "mouseup",
      ((e: PointerEvent) => {
        if (this._creatingNewEdge) {
          console.log("enter dropzone and creating new edge", e);
          this._newEdgeBeingCreatedMetadata.target = node.id;
          if (
            this._newEdgeBeingCreatedMetadata.source &&
            this._newEdgeBeingCreatedMetadata.target
          ) {
            this.addEdge({
              id:
                "NEW_EDGE_" +
                this._newEdgeBeingCreatedMetadata.source +
                "-" +
                this._newEdgeBeingCreatedMetadata.target,
              source: this._newEdgeBeingCreatedMetadata.source,
              target: this._newEdgeBeingCreatedMetadata.target,
              data: {} as EdgeType,
            });
          }
        }
      }) as EventListener,
      this._disposer
    );
  }

  private setupNodeDragging(
    nodeElement: HTMLElement,
    anchorStartElements: HTMLElement,
    anchorEndElements: HTMLElement,
    node: InternalNode<NodeType>
  ) {
    // Inspired by @LINK https://infoheap.com/javascript-make-element-draggable/
    let dragging = false;
    let dragStartX: number | null;
    let dragStartY: number | null;
    let objInitLeft: number | null;
    let objInitTop: number | null;

    const onMouseDown = (e: MouseEvent): void => {
      e.stopPropagation();
      dragging = true;
      // Store element page position on mousedown using element.offsetLeft and element.offsetTop
      objInitLeft = nodeElement.offsetLeft;
      objInitTop = nodeElement.offsetTop;
      // Store click event’s page position on mousedown using event.pageX and event.pageY.
      // Note that this will be slightly different from element’s position depending upon where did use click within element.
      dragStartX = e.pageX;
      dragStartY = e.pageY;
    };
    addEventListener(
      nodeElement,
      "mousedown",
      onMouseDown as EventListener,
      this._disposer
    );
    const onMouseMove = (e: MouseEvent): void => {
      if (dragging && objInitLeft && objInitTop && dragStartX && dragStartY) {
        e.stopPropagation();
        // xDelta and yDelta are the difference between current mouse position and the position on mousedown
        const xDelta = e.pageX - dragStartX;
        const x = objInitLeft + xDelta / this._zoomLevel;
        const yDelta = e.pageY - dragStartY;
        const y = objInitTop + yDelta / this._zoomLevel;
        nodeElement.style.left = x + "px";
        nodeElement.style.top = y + "px";
        node.x = x;
        node.y = y;
        this.setNodeLinkAnchors(node);
        anchorStartElements.style.left = node.startAnchorPoint?.x + "px";
        anchorStartElements.style.top = node.startAnchorPoint?.y + "px";
        anchorEndElements.style.left = node.endAnchorPoint?.x + "px";
        anchorEndElements.style.top = node.endAnchorPoint?.y + "px";

        this._nodesMapById.set(node.id, node);
        const edges = this._edgesMapByNodeId.get(node.id);
        if (edges) {
          for (const edge of edges) {
            const d = this.getEdgePathDValue(edge);
            const path = this._svg?.querySelector(
              `path[data-edge-id="${edge.id}"]`
            ) as SVGElement;
            if (d) {
              path.setAttribute("d", d);
            }
          }
        }
      }
    };
    // add "mousemove" event listener to the document because user can move the mouse outside the element
    // after having started dragging the element without lifting the mouse button first
    addEventListener(
      document,
      "mousemove",
      onMouseMove as EventListener,
      this._disposer
    );
    const onMouseUp = (e: MouseEvent): void => {
      dragging = false;
      objInitLeft = null;
      objInitTop = null;
      dragStartX = null;
      dragStartY = null;
      e.stopPropagation();
    };
    // add "mouseup" event listener to the document because user can trigger mouseup anywhere on the page
    // and we need to stop dragging when user does that
    addEventListener(
      document,
      "mouseup",
      onMouseUp as EventListener,
      this._disposer
    );
  }
}
