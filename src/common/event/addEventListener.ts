import { Disposer } from "../disposer/Disposer";
import { FullyLinkedEventEnum } from "./FullyLinkedEventEnum";

export const addDisposableEventListener = (
  element: HTMLElement | Document,
  eventName: keyof HTMLElementEventMap | FullyLinkedEventEnum,
  eventListener: EventListener,
  disposer: Disposer
) => {
  element.addEventListener(eventName, eventListener);
  disposer.add({
    dispose: () => {
      element.removeEventListener(eventName, eventListener);
    },
  });
};
