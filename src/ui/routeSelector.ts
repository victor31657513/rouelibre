import { GPXPoint, Vec3, parseGPX, projectToLocal } from '../gpx'
import { List } from './List'

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
    empty.classList.add('p-2', 'text-sm', 'text-base-content/60')
    container.appendChild(empty)
    return
  }
  const list = new List<{ name: string; url: string }>({
    container,
    renderItem: async (file) => {
      const li = document.createElement('li')
      const btn = document.createElement('button')
      btn.className = 'flex w-full flex-col items-start gap-1 px-4 py-2 text-left'

      const label = document.createElement('span')
      label.textContent = file.name
      label.className = 'text-sm font-medium'
      btn.appendChild(label)

      const resFile = await fetch(`${base}${file.url}`)
      if (!resFile.ok) {
        const invalid = document.createElement('span')
        invalid.className = 'text-error'
        invalid.textContent = 'Fichier invalide'
        btn.appendChild(invalid)
      } else {
        const xmlText = await resFile.text()
        const points = parseGPX(xmlText)
        if (!points.length) {
          const invalid = document.createElement('span')
          invalid.className = 'text-error'
          invalid.textContent = 'Fichier invalide'
          btn.appendChild(invalid)
        } else {
          const { path3D } = projectToLocal(points)
          const canvas = document.createElement('canvas')
          canvas.height = 40
          canvas.className = 'block h-10 w-full rounded bg-primary'
          btn.appendChild(canvas)

          requestAnimationFrame(() => {
            canvas.width = canvas.clientWidth
            const ctx = canvas.getContext('2d')
            if (ctx && path3D.length) {
              const distances: number[] = [0]
              for (let i = 1; i < path3D.length; i++) {
                distances[i] =
                  distances[i - 1] + path3D[i].distanceTo(path3D[i - 1])
              }
              const total = distances[distances.length - 1] || 1
              const minY = Math.min(...path3D.map((p) => p.y))
              const maxY = Math.max(...path3D.map((p) => p.y))
              const range = maxY - minY || 1

              const points2D = path3D.map((point, i) => ({
                x: (distances[i] / total) * canvas.width,
                y:
                  canvas.height - ((point.y - minY) / range) * canvas.height,
              }))

              ctx.clearRect(0, 0, canvas.width, canvas.height)

              const gradient = ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
              )
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
            }
          })

          btn.addEventListener('click', () => onSelect(path3D, points, file.url))
        }
      }

      li.appendChild(btn)
      return li
    },
  })

  await list.setItems(files)
}
