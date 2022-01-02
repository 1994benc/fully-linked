import { FullyLinkedEvent } from "./FullyLinkedEvent";
import { FullyLinkedEventEnum } from "./FullyLinkedEventEnum";

export function dispatchFullyLinkedEvent<
  NodeType,
  EdgeType,
  SpecificFullyLinkedEventInfo,
  GlobalNodePropsType
>(
  eventName: FullyLinkedEventEnum,
  params: FullyLinkedEvent<NodeType, EdgeType, SpecificFullyLinkedEventInfo, GlobalNodePropsType>,
  containerElement: HTMLElement
) {
  const event = new CustomEvent(eventName, { detail: { ...params } });
  containerElement.dispatchEvent(event);
}
