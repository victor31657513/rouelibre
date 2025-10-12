import { describe, it, expect } from 'vitest';
import { initPeloton } from '../src/peloton';

describe('relayCluster', () => {
  it('placeholder', () => {
    expect(true).toBe(true);
  });

  it('initialises peloton positions', () => {
    const path = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 }
    ];
    const pos = initPeloton(path, 5);
    expect(pos).toBeInstanceOf(Float32Array);
    expect(pos.length).toBe(15);
  });
});
