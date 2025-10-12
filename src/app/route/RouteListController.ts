import { GPXPoint, projectToLocal, type RoutePoint, parseGPX } from '../../domain/route/gpx'
import { List } from '../ui/List'

/**
 * @fileoverview Controller responsible for populating the route selection list.
 * Fetches the GPX catalog, renders previews and notifies consumers when a route
 * is chosen by the user.
 *
 * Extension: Provide filtering or search by keeping a reference to the full
 * collection and exposing additional public methods. The current contract only
 * depends on `initialise` and the `onSelect` callback.
 */
export type RouteSelectCallback = (
  path: RoutePoint[],
  points: GPXPoint[],
  url: string,
) => void

export class RouteListController {
  private readonly containerId: string
  private readonly onSelect: RouteSelectCallback

  constructor(containerId: string, onSelect: RouteSelectCallback) {
    this.containerId = containerId
    this.onSelect = onSelect
  }

  /** Loads the catalog and renders it inside the configured container. */
  async initialise(): Promise<void> {
    const container = document.getElementById(this.containerId)
    if (!container) return

    const base = import.meta.env.BASE_URL
    const res = await fetch(`${base}gpx/index.json`)
    if (!res.ok) {
      container.textContent = 'Impossible de charger les parcours'
      return
    }
    const files: { name: string; url: string }[] = await res.json()

    if (!files.length) {
      const empty = document.createElement('li')
      empty.textContent = 'Aucun parcours trouvé'
      empty.classList.add('p-2', 'text-sm', 'text-base-content/60')
      container.appendChild(empty)
      return
    }

    const list = new List<{ name: string; url: string }>({
      container,
      renderItem: (file) => this.renderFileEntry(file, base),
    })

    await list.setItems(files)
  }

  private async renderFileEntry(
    file: { name: string; url: string },
    baseUrl: string,
  ): Promise<HTMLElement> {
    const li = document.createElement('li')
    const button = document.createElement('button')
    button.className = 'flex w-full flex-col items-start gap-1 px-4 py-2 text-left'

    const label = document.createElement('span')
    label.textContent = file.name
    label.className = 'text-sm font-medium'
    button.appendChild(label)

    try {
      const response = await fetch(`${baseUrl}${file.url}`)
      if (!response.ok) {
        button.appendChild(this.createErrorLabel('Fichier invalide'))
        return li.appendChild(button), li
      }

      const xmlText = await response.text()
      const points = parseGPX(xmlText)
      if (!points.length) {
        button.appendChild(this.createErrorLabel('Fichier invalide'))
        return li.appendChild(button), li
      }

      const { path3D } = projectToLocal(points)
      const preview = this.createElevationPreview(path3D)
      button.appendChild(preview)
      button.addEventListener('click', () => this.onSelect(path3D, points, file.url))
    } catch (error) {
      console.error('Unable to load route preview', error)
      button.appendChild(this.createErrorLabel('Chargement impossible'))
    }

    li.appendChild(button)
    return li
  }

  private createErrorLabel(message: string): HTMLElement {
    const label = document.createElement('span')
    label.className = 'text-error'
    label.textContent = message
    return label
  }

  private createElevationPreview(path3D: RoutePoint[]): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.height = 40
    canvas.className = 'block h-10 w-full rounded bg-primary'

    requestAnimationFrame(() => {
      canvas.width = canvas.clientWidth
      const ctx = canvas.getContext('2d')
      if (!ctx || !path3D.length) return

      const distances: number[] = [0]
      for (let i = 1; i < path3D.length; i++) {
        distances[i] = distances[i - 1] + path3D[i].distanceTo(path3D[i - 1])
      }
      const total = distances[distances.length - 1] || 1
      const minY = Math.min(...path3D.map((p) => p.y))
      const maxY = Math.max(...path3D.map((p) => p.y))
      const range = maxY - minY || 1

      const points2D = path3D.map((point, i) => ({
        x: (distances[i] / total) * canvas.width,
        y: canvas.height - ((point.y - minY) / range) * canvas.height,
      }))

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')

      ctx.beginPath()
      ctx.moveTo(points2D[0].x, canvas.height)
      points2D.forEach((point) => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.lineTo(points2D[points2D.length - 1].x, canvas.height)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.lineWidth = 2
      ctx.beginPath()
      points2D.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, canvas.height - 1)
      ctx.lineTo(canvas.width, canvas.height - 1)
      ctx.stroke()
    })

    return canvas
  }
}
