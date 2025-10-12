/**
 * @fileoverview Simple state container tracking the rider selection index.
 * Provides controlled setters ensuring the index always stays within bounds.
 *
 * Extension: For multi-selection or richer state keep the same interface but
 * expose additional observables or callbacks from this module instead of
 * mutating the exported value directly.
 */
export class SelectionState {
  private index = 0

  /** Returns the current selected rider index. */
  get value(): number {
    return this.index
  }

  /**
   * Sets the selection to an absolute index while wrapping within the rider count.
   * @param index Target index that may fall outside the [0, count) range.
   * @param count Total number of riders to wrap against.
   */
  set(index: number, count: number): number {
    this.index = ((index % count) + count) % count
    return this.index
  }

  /**
   * Applies a delta to the selection while ensuring wrapping within the count.
   * @param delta Signed offset applied to the current index.
   * @param count Total number of riders to wrap against.
   */
  move(delta: number, count: number): number {
    return this.set(this.index + delta, count)
  }
}
