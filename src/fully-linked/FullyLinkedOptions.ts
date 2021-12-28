export interface FullyLinkedOptions {
  /** The unique id of the FullyLinked graph. */
  id: string;
  /** Element that contains your FullyLinked elements */
  container: HTMLElement;
  /** Should nodes be draggable? Defaulted to true. */
  allowDragNodes?: boolean;
}
