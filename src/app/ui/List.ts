/**
 * @fileoverview Minimal utility to render interactive HTML lists.
 * Turns an array of items into DOM nodes using a render callback so application
 * controllers can focus on behaviour rather than DOM bookkeeping.
 *
 * Extension: Support virtualization or diffing by adding new methods that reuse
 * the same contract. Consumers rely only on `setItems`.
 */
export interface ListProps<T> {
  /** Container element that will receive rendered list items. */
  container: HTMLElement
  /**
   * Callback used to render each item. It can return an HTMLElement
   * synchronously or a Promise resolving to an HTMLElement.
   */
  renderItem: (item: T, index: number) => HTMLElement | Promise<HTMLElement>
}

/** Simple utility component to render a list of items inside a container. */
export class List<T> {
  private container: HTMLElement
  private renderItem: (item: T, index: number) => HTMLElement | Promise<HTMLElement>

  constructor(props: ListProps<T>) {
    this.container = props.container
    this.renderItem = props.renderItem
  }

  /** Replace the current content of the container with the provided items. */
  async setItems(items: T[]): Promise<void> {
    this.container.innerHTML = ''
    for (let i = 0; i < items.length; i++) {
      const el = await this.renderItem(items[i], i)
      this.container.appendChild(el)
    }
  }
}
