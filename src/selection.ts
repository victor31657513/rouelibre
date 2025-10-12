export let selectedIndex = 0;

export function setSelectedIndex(index: number, count: number): number {
  selectedIndex = ((index % count) + count) % count;
  return selectedIndex;
}

export function changeSelectedIndex(delta: number, count: number): number {
  return setSelectedIndex(selectedIndex + delta, count);
}
