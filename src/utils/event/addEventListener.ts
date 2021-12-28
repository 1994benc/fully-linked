import { Disposer } from "../../fully-linked/Disposer";

export const addEventListener = (
  element: HTMLElement,
  eventName: keyof HTMLElementEventMap,
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
