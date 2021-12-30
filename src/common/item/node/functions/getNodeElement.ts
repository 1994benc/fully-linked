export function getNodeElement(id: string, container: HTMLElement) {
    return container.querySelector(
        `[data-node-id="${id}"].fully-linked-node-wrapper`
      ) as HTMLElement;
}