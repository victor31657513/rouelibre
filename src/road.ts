export function inRoad(
  _s: number,
  t: number,
  roadWidth: number,
  laneWidth: number,
  margin = 0.05,
): boolean {
  const half = roadWidth / 2 - laneWidth / 2 - margin
  return Math.abs(t) <= half
}
