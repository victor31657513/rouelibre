import { GPXPoint, Vec3, parseGPX, projectToLocal } from '../gpx'

export type RouteSelectCallback = (path: Vec3[], points: GPXPoint[]) => void

export async function initRouteSelector(containerId: string, onSelect: RouteSelectCallback) {
  const container = document.getElementById(containerId)
  if (!container) return

  const modules = import.meta.glob('/gpx/*.gpx', { as: 'url', eager: true })
  const files = Object.entries(modules).map(([path, url]) => ({
    name: path.split('/').pop()!,
    url: url as string,
  }))

  for (const file of files) {
    const item = document.createElement('div')
    item.style.cursor = 'pointer'
    item.style.marginBottom = '8px'

    const label = document.createElement('div')
    label.textContent = file.name
    label.style.marginBottom = '2px'
    item.appendChild(label)

    const canvas = document.createElement('canvas')
    canvas.width = 120
    canvas.height = 40
    item.appendChild(canvas)

    container.appendChild(item)

    const xmlText = await fetch(file.url).then((r) => r.text())
    const points = parseGPX(xmlText)
    const { path3D } = projectToLocal(points)

    const ctx = canvas.getContext('2d')
    if (ctx && path3D.length) {
      const distances: number[] = [0]
      for (let i = 1; i < path3D.length; i++) {
        distances[i] = distances[i - 1] + path3D[i].distanceTo(path3D[i - 1])
      }
      const total = distances[distances.length - 1] || 1
      const minY = Math.min(...path3D.map((p) => p.y))
      const maxY = Math.max(...path3D.map((p) => p.y))
      const range = maxY - minY || 1
      ctx.strokeStyle = '#fff'
      ctx.beginPath()
      for (let i = 0; i < path3D.length; i++) {
        const x = (distances[i] / total) * canvas.width
        const y = canvas.height - ((path3D[i].y - minY) / range) * canvas.height
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    item.addEventListener('click', () => onSelect(path3D, points))
  }
}
