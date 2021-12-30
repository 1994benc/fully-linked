import { FullyLinkedEvent } from "./FullyLinkedEvent";
import { FullyLinkedEventEnum } from "./FullyLinkedEventEnum";

export function dispatchFullyLinkedEvent<
  NodeType,
  EdgeType,
  SpecificFullyLinkedEventInfo
>(
  eventName: FullyLinkedEventEnum,
  params: FullyLinkedEvent<NodeType, EdgeType, SpecificFullyLinkedEventInfo>,
  containerElement: HTMLElement
) {
  const event = new CustomEvent(eventName, { detail: { ...params } });
  containerElement.dispatchEvent(event);
}
