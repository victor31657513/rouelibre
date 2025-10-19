/**
 * Minimal toggle rendering the available simulation modes.
 *
 * Extension: expose keyboard navigation and focus trapping to improve
 * accessibility when additional controls are introduced.
 */
import type { SimulationMode, SimulationModeId } from '../app/modes'

export interface ModeSelectorHandle {
  /** Programmatically update the active mode button. */
  setActive(id: SimulationModeId): void
}

interface InitOptions {
  containerId: string
  modes: readonly SimulationMode[]
  activeId: SimulationModeId
  onSelect: (mode: SimulationMode) => void
}

const BASE_BUTTON_CLASSES = [
  'btn',
  'btn-sm',
  'btn-outline',
  'min-w-[6rem]',
  'flex-1',
  'flex',
  'flex-col',
  'items-start',
  'gap-0.5',
]

const ACTIVE_BUTTON_CLASSES = ['btn-primary', 'text-primary-content']

function formatRiderCount(count: number): string {
  return `${count} coureur${count > 1 ? 's' : ''}`
}

/**
 * Initialises the mode selector UI inside the provided container.
 *
 * @returns A handle allowing the caller to update the selection.
 */
export function initModeSelector(options: InitOptions): ModeSelectorHandle | null {
  const container = document.getElementById(options.containerId)
  if (!container) return null

  const buttons = new Map<SimulationModeId, HTMLButtonElement>()
  container.innerHTML = ''

  options.modes.forEach((mode) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.dataset.modeId = mode.id
    button.classList.add(...BASE_BUTTON_CLASSES)
    button.setAttribute('aria-pressed', mode.id === options.activeId ? 'true' : 'false')

    const title = document.createElement('span')
    title.className = 'text-sm font-semibold'
    title.textContent = mode.label
    button.appendChild(title)

    const hint = document.createElement('span')
    hint.className = 'text-xs opacity-70'
    hint.textContent = mode.description ?? formatRiderCount(mode.riderCount)
    button.appendChild(hint)

    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return
      selectMode(mode.id)
      options.onSelect(mode)
    })

    container.appendChild(button)
    buttons.set(mode.id, button)
  })

  const selectMode = (id: SimulationModeId) => {
    buttons.forEach((btn, modeId) => {
      const isActive = modeId === id
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false')
      if (isActive) {
        btn.classList.add(...ACTIVE_BUTTON_CLASSES)
        btn.classList.remove('btn-outline')
      } else {
        btn.classList.remove(...ACTIVE_BUTTON_CLASSES)
        if (!btn.classList.contains('btn-outline')) {
          btn.classList.add('btn-outline')
        }
      }
    })
  }

  selectMode(options.activeId)

  return {
    setActive: (id: SimulationModeId) => {
      if (!buttons.has(id)) return
      selectMode(id)
    },
  }
}
