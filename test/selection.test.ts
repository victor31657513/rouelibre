import { describe, it, expect, beforeEach } from 'vitest'
import { SelectionState } from '../src/app/state/selectionState'

const N = 184

describe('selection', () => {
  let selection: SelectionState

  beforeEach(() => {
    selection = new SelectionState()
    selection.set(0, N)
  })

  it('increments and decrements index', () => {
    selection.move(1, N)
    expect(selection.value).toBe(1)
    selection.move(-1, N)
    expect(selection.value).toBe(0)
  })

  it('moves vertically by 9', () => {
    selection.move(9, N)
    expect(selection.value).toBe(9)
    selection.move(-9, N)
    expect(selection.value).toBe(0)
  })

  it('wraps around correctly', () => {
    selection.move(-1, N)
    expect(selection.value).toBe(N - 1)
  })
})
