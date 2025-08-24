import { GPXPoint, Vec3, parseGPX, projectToLocal } from '../gpx'

export type RouteSelectCallback = (path: Vec3[], points: GPXPoint[], url: string) => void

export async function initRouteSelector(containerId: string, onSelect: RouteSelectCallback) {
  const container = document.getElementById(containerId)
  if (!container) return
  const base = import.meta.env.BASE_URL
  const res = await fetch(`${base}gpx/index.json`)
  const files: { name: string; url: string }[] = await res.json()

  if (!files.length) {
    const empty = document.createElement('li')
    empty.textContent = 'Aucun parcours trouvé'
    empty.classList.add('p-2', 'text-sm', 'text-gray-500', 'dark:text-gray-400')
    container.appendChild(empty)
    return
  }

  for (const file of files) {
    const item = document.createElement('li')
    item.classList.add(
      'cursor-pointer',
      'px-4',
      'py-2',
      'bg-white',
      'hover:bg-gray-100',
      'dark:bg-gray-800',
      'dark:hover:bg-gray-700'
    )

    const label = document.createElement('div')
    label.textContent = file.name
    label.classList.add('mb-0.5', 'text-sm', 'font-medium', 'text-gray-900', 'dark:text-white')
    item.appendChild(label)

    container.appendChild(item)

    const resFile = await fetch(`${base}${file.url}`)
    if (!resFile.ok) {
      const invalid = document.createElement('div')
      invalid.classList.add('text-red-600', 'dark:text-red-400')
      invalid.textContent = 'Fichier invalide'
      item.appendChild(invalid)
      continue
    }

    const xmlText = await resFile.text()
    const points = parseGPX(xmlText)
    if (!points.length) {
      const invalid = document.createElement('div')
      invalid.classList.add('text-red-600', 'dark:text-red-400')
      invalid.textContent = 'Fichier invalide'
      item.appendChild(invalid)
      continue
    }

    const { path3D } = projectToLocal(points)
    const canvas = document.createElement('canvas')
    canvas.width = 120
    canvas.height = 40
    item.appendChild(canvas)

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

    item.addEventListener('click', () => onSelect(path3D, points, file.url))
  }
}
