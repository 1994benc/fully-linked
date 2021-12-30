import { Disposer } from "../disposer/Disposer";
import { FullyLinkedEventEnum } from "./FullyLinkedEventEnum";

export const addDisposableEventListener = (
  element: Element | Document,
  eventName: keyof HTMLElementEventMap | FullyLinkedEventEnum,
  eventListener: EventListener,
  disposer: Disposer,
  specificDisposerKeyToUse?: string
) => {
  element.addEventListener(eventName, eventListener);
  if (specificDisposerKeyToUse){
    disposer.addSpecific(specificDisposerKeyToUse, {
      dispose: () => {
        element.removeEventListener(eventName, eventListener);
      },
    });
  } else {
    disposer.add({
      dispose: () => {
        element.removeEventListener(eventName, eventListener);
      },
    });
  }
};
