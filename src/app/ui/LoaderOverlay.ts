/**
 * @fileoverview Controls the loading overlay displayed while fetching GPX data.
 * Provides imperative helpers used by the application controller when starting
 * or completing route downloads.
 *
 * Extension: Animate transitions or add error states by adding new methods that
 * toggle additional CSS classes on the stored elements.
 */
export class LoaderOverlay {
  constructor(
    private readonly container: HTMLDivElement,
    private readonly progress: HTMLProgressElement,
  ) {}

  show(): void {
    this.container.classList.add('flex')
    this.container.classList.remove('hidden')
    this.progress.value = 0
  }

  hide(): void {
    this.container.classList.remove('flex')
    this.container.classList.add('hidden')
  }

  updateProgress(value: number): void {
    this.progress.value = value
  }
}
