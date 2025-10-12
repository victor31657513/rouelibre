/**
 * @fileoverview Encapsulates the playback buttons (start, pause, reset, home).
 * Standardises enabling/disabling logic and emits callbacks on user actions.
 *
 * Extension: Add icons or keyboard shortcuts by registering additional event
 * listeners in the constructor without changing the public API.
 */
export interface PlaybackCallbacks {
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onHome: () => void
}

export class PlaybackControls {
  private hasStarted = false

  constructor(
    private readonly start: HTMLButtonElement,
    private readonly pause: HTMLButtonElement,
    private readonly reset: HTMLButtonElement,
    private readonly home: HTMLButtonElement,
  ) {}

  bind(callbacks: PlaybackCallbacks): void {
    this.start.addEventListener('click', () => {
      callbacks.onStart()
    })
    this.pause.addEventListener('click', () => {
      callbacks.onPause()
    })
    this.reset.addEventListener('click', () => {
      callbacks.onReset()
    })
    this.home.addEventListener('click', () => {
      callbacks.onHome()
    })
  }

  setRouteLoaded(loaded: boolean): void {
    this.start.disabled = !loaded
    this.pause.disabled = !loaded
    this.reset.disabled = !loaded
    this.home.classList.toggle('hidden', !loaded)
    if (loaded) {
      this.hasStarted = false
      this.start.textContent = 'Start'
      this.pause.disabled = true
    }
  }

  setRunning(running: boolean): void {
    if (running) {
      this.start.disabled = true
      this.start.textContent = 'Start'
      this.pause.disabled = false
      this.hasStarted = true
    } else {
      this.start.disabled = false
      this.pause.disabled = true
    }
  }

  setPaused(paused: boolean): void {
    this.pause.disabled = paused
    this.start.disabled = !paused
    if (paused) {
      this.start.textContent = this.hasStarted ? 'Reprendre' : 'Start'
    } else {
      this.start.textContent = 'Start'
    }
  }

  disableDuringLoad(): void {
    this.start.disabled = true
    this.pause.disabled = true
    this.reset.disabled = true
  }
}
