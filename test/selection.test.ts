import { describe, it, expect, beforeEach } from 'vitest'
import { selectedIndex, setSelectedIndex, changeSelectedIndex } from '../src/domain/state/selection'

const N = 184

describe('selection', () => {
  beforeEach(() => {
    setSelectedIndex(0, N)
  })

  it('increments and decrements index', () => {
    changeSelectedIndex(1, N)
    expect(selectedIndex).toBe(1)
    changeSelectedIndex(-1, N)
    expect(selectedIndex).toBe(0)
  })

  it('moves vertically by 9', () => {
    changeSelectedIndex(9, N)
    expect(selectedIndex).toBe(9)
    changeSelectedIndex(-9, N)
    expect(selectedIndex).toBe(0)
  })

  it('wraps around correctly', () => {
    changeSelectedIndex(-1, N)
    expect(selectedIndex).toBe(N - 1)
  })
})
