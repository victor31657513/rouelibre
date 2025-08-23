import { describe, it, expect } from 'vitest';
import { initPeloton, simulationStarted } from '../src/peloton';

describe('relayCluster', () => {
  it('placeholder', () => {
    expect(true).toBe(true);
  });

  it('starts simulation after route preparation', () => {
    const path = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 }
    ];
    initPeloton(path, 5);
    expect(simulationStarted).toBe(true);
  });
});
