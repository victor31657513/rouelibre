/**
 * Global selection state shared between camera controls and UI.
 *
 * Extension: Replace with a more robust store (e.g. observable) if more
 * components need to react to selection changes.
 */
export let selectedIndex = 0

/** Sets the selected rider index while keeping the value within range. */
export function setSelectedIndex(index: number, count: number): number {
  selectedIndex = ((index % count) + count) % count
  return selectedIndex
}

/** Applies a delta to the current selection. */
export function changeSelectedIndex(delta: number, count: number): number {
  return setSelectedIndex(selectedIndex + delta, count)
}
