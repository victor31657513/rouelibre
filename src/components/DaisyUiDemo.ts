/**
 * Simple demonstration of DaisyUI components.
 */
export function createDaisyUiDemo(): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = `
    <button class="btn btn-primary">Primary</button>
    <button class="btn">Default</button>
    <input class="input input-bordered" placeholder="Your name" />
    <select class="select select-bordered"><option>One</option><option>Two</option></select>
    <span class="badge badge-info">Info</span>
  `
  return container
}

/**
 * Mount the demo inside the provided element.
 */
export function mountDaisyUiDemo(parent: HTMLElement): void {
  parent.appendChild(createDaisyUiDemo())
}
